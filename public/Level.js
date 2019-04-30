`use strict`
import Compositor from './Compositor.js'
import { Matrix } from './math.js'

class Level {
  constructor() {
    this.comp = new Compositor()
    this.entities = new Set()
    this.tiles = new Matrix()
  }

  update(delta) {
    this.entities.forEach((ent) => ent.update(delta))
  }
}

export default Level
