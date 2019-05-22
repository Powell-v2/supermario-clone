`use strict`
import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'
import EntityCollider from './EntityCollider.js'

import {
  launch as launchFireworks,
  destroy as destroyFireworks
} from './effects/fireworks/index.js'
import { setupKeyboard } from './input.js'
import { createBackgroundLayer, createSpriteLayer } from './layers.js'
import { createGrid } from './loaders/level.js'
import { createPlayerEnvironment, setupPlayerSelectors } from './main.js'
import { isMobile } from './utils/browser.js'

class Level {
  constructor(lvlSpec, bgSprites, entityFactory) {
    this.comp = new Compositor()
    this.entities = new Set()

    this.gravity = 1500
    this.totalTime = 0

    this.entityCollider = new EntityCollider(this.entities)
    this.tileCollider = null

    this.lvlSpec = lvlSpec
    this.bgSprites = bgSprites
    this.entityFactory = entityFactory

    this.audioControls = null
    this.timer = null
    this.ctx = null
    this.camera = null

    this.interactionGrid = null
  }

  setupCollision() {
    const { layers, patterns } = this.lvlSpec
    const mergedTiles = layers.reduce((acc, layer) => {
      return acc.concat(layer.tiles)
    }, [])

    this.tileCollider = new TileCollider(createGrid(mergedTiles, patterns))
  }

  setupBackgrounds() {
    const { layers, patterns } = this.lvlSpec

    layers.forEach((layer, i) => {
      const bgGrid = createGrid(layer.tiles, patterns)
      const bgLayer = createBackgroundLayer(this, bgGrid, this.bgSprites)

      this.comp.layers.push(bgLayer)

      // TODO: find better way to identify interaction grid
      if (i === 1) this.interactionGrid = bgGrid
    })
  }

  setupEntities() {
    this.lvlSpec.entities.forEach(({ name, position: [x, y] }) => {
      const entity = this.entityFactory[name]()
      entity.pos.set(x, y)
      this.entities.add(entity)
    })

    this.comp.layers.push(createSpriteLayer(this.entities))
  }

  reset() {
    this.comp.destroy()

    this.setupCollision()
    this.setupBackgrounds()
    this.setupEntities()
  }

  init(ev) {
    const overlay = document.getElementById(`gameOverlay`)

    overlay.style.visibility = `hidden`
    overlay.style.animation = null

    const { name } = ev.target.dataset
    const hero = this.entityFactory[name]()
    const playerEnv = createPlayerEnvironment(hero)

    hero.controls = setupKeyboard(hero)

    this.entities.clear()
    this.entities.add(playerEnv)

    if (isMobile()) {
      const scene = document.getElementById(`scene`)
      hero.run.direction = 1
      hero.controls.listenTo(scene)
    }
    else {
      hero.controls.listenTo(window)
    }

    const rightmostLevelEdge = this.interactionGrid.grid.length * 35 - window.innerWidth

    this.timer.update = (delta) => {
      this.update(delta)

      // Limit camera movement to max max level width minus screen width.
      // Behind the edge there is a wall of tiles which blocks the character.
      this.camera.pos.x = Math.max(
        0,
        Math.min(hero.pos.x - 105, rightmostLevelEdge)
      )

      this.comp.draw(this.ctx, this.camera)
    }

    if (this.audioControls.isMuted) {
      this.audioControls.unmute()
    }
    else {
      this.audioControls.play(`soundtrack`)
      this.audioControls.setupMuteButton(document.querySelector('.mute'), ev.type)
    }
  }

  end() {
    const fireworksCanvas = launchFireworks()
    fireworksCanvas.style.animation = `fade_in 6s`

    const overlayMsg = document.querySelector(`.plate__inner`)
    overlayMsg.innerText = `Well done!`

    const overlay = document.getElementById(`gameOverlay`)
    overlay.style.visibility = `visible`
    overlay.style.animation = `fade_in 6s`

    if (!this.audioControls.isMuted) {
      this.audioControls.muteOne(`jump`)
      this.audioControls.muteOne(`soundtrack`)
    }

    this.setupPlayerSelectors((ev) => {
      destroyFireworks()
      this.reset()
      this.init(ev)
    })
  }

  update(delta) {
    this.totalTime += delta

    this.entities.forEach((ent) => {
      ent.update(delta, this)

      ent.pos.x += ent.vel.x * delta
      this.tileCollider.checkX(ent, this)

      ent.pos.y += ent.vel.y * delta
      this.tileCollider.checkY(ent, this)

      ent.vel.y += this.gravity * delta
    })

    this.entities.forEach((ent) => {
      this.entityCollider.check(ent)
    })
  }
}

export default Level
