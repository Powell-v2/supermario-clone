`use strict`
import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'

import { Matrix } from './math.js'

class Level {
  constructor() {
    this.comp = new Compositor()
    this.entities = new Set()
    this.tiles = new Matrix()

    this.tileCollider = new TileCollider(this.tiles)
  }

  update(delta) {
    this.entities.forEach((ent) => {
      ent.update(delta)

      this.tileCollider.checkY(ent)
    })
  }
}

export default Level
