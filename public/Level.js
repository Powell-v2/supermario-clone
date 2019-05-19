`use strict`
import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'
import EntityCollider from './EntityCollider.js'

import { createBackgroundLayer, createSpriteLayer } from './layers.js'
import { createGrid } from './loaders/level.js'

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
    this.entityFactory = bgSprites

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

  update(delta) {
    this.totalTime += delta

    this.entities.forEach((ent) => {
      ent.update(delta, this)

      ent.pos.x += ent.vel.x * delta
      this.tileCollider.checkX(ent)

      ent.pos.y += ent.vel.y * delta
      this.tileCollider.checkY(ent, this.interactionGrid)

      ent.vel.y += this.gravity * delta
    })

    this.entities.forEach((ent) => {
      this.entityCollider.check(ent)
    })
  }
}

export default Level
