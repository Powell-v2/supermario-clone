`use strict`
import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'
import EntityCollider from './EntityCollider.js'

class Level {
  constructor() {
    this.comp = new Compositor()
    this.entities = new Set()

    this.gravity = 1500
    this.totalTime = 0

    this.entityCollider = new EntityCollider(this.entities)
    this.tileCollider = null
  }

  setCollisionGrid(matrix) {
    this.tileCollider = new TileCollider(matrix)
  }

  update(delta) {
    this.totalTime += delta

    this.entities.forEach((ent) => {
      const { pos, vel } = ent

      ent.update(delta, this)

      pos.x += vel.x * delta
      this.tileCollider.checkX(ent)

      pos.y += vel.y * delta
      this.tileCollider.checkY(ent)

      ent.vel.y += this.gravity * delta
    })

    this.entities.forEach((ent) => {
      this.entityCollider.check(ent)
    })
  }
}

export default Level
