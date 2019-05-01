`use strict`
import { Vector2 } from './math.js'

class Camera {
  constructor() {
    this.pos = new Vector2(0, 0)
    this.size = new Vector2(450, 300)
  }
}

export default Camera
