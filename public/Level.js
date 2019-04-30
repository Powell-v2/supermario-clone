`use strict`
import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'

import { Matrix } from './math.js'

class Level {
  constructor() {
    this.comp = new Compositor()
    this.entities = new Set()
    this.gravity = 1500
    this.tiles = new Matrix()

    this.tileCollider = new TileCollider(this.tiles)
  }

  update(delta) {
    this.entities.forEach((ent) => {
      const { pos, vel } = ent

      ent.update(delta)

      pos.x += vel.x * delta
      this.tileCollider.checkX(ent)

      pos.y += vel.y * delta
      this.tileCollider.checkY(ent)

      ent.vel.y += this.gravity * delta
    })
  }
}

export default Level
