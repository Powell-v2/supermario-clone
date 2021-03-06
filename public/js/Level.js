`use strict`
import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'

import {
  launch as launchFireworks,
  destroy as destroyFireworks,
  id as fireworksId,
} from './effects/fireworks/index.js'
import { setupKeyboard } from './input.js'
import createSpriteLayer from './layers/sprite.js'
import createBackgroundLayer from './layers/background.js'
import { createGrid } from './loaders/level.js'
import { createPlayerEnvironment, setupPlayerSelectors } from './main.js'
import { isMobile } from './utils/browser.js'

class Level {
  constructor(lvlSpec, bgSprites, entityFactory) {
    this.comp = new Compositor()
    this.entities = new Set()

    this.gravity = 1500
    this.totalTime = 0

    this.tileCollider = null

    this.lvlSpec = lvlSpec
    this.bgSprites = bgSprites
    this.entityFactory = entityFactory

    this.audioControls = null
    this.dashboard = null
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

    if (this.dashboard) {
      this.dashboard.reset()
    }

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

    if (!this.audioControls.isMuted) {
      // Initial setup.
      this.audioControls.setupMuteButton(document.querySelector(`.mute`), ev.type)
      this.audioControls.play(`soundtrack`)

      // On game reset.
      this.audioControls.unmuteOne(`jump`)
      this.audioControls.unmuteOne(`soundtrack`)
    }

    this.dashboard.init()
  }

  end() {
    const fireworksCanvas = launchFireworks()
    fireworksCanvas.style.animation = `fade_in 2s`

    const overlayMsg = document.querySelector(`.plate__inner`)
    overlayMsg.innerText = `Well done!`

    const overlay = document.getElementById(`gameOverlay`)
    overlay.style.visibility = `visible`
    overlay.style.animation = `fade_in 2s`

    if (!this.audioControls.isMuted) {
      this.audioControls.muteOne(`jump`)
      this.audioControls.muteOne(`soundtrack`)
    }

    let timeoutId1
    let timeoutId2

    timeoutId1 = setTimeout(() => {
      fireworksCanvas.style.animation = `fade_out 2s`
      timeoutId2 = setTimeout(() => destroyFireworks(), 2000)

      overlayMsg.innerText = `Play again?`
    }, 5000)

    setupPlayerSelectors((ev) => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)

      if (document.getElementById(fireworksId)) {
        destroyFireworks()
      }
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
  }
}

export default Level
