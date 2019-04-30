`use strict`
class Vector2 {
  constructor(x, y) {
    this.set(x, y)
  }

  set(x, y) {
    this.x = x
    this.y = y
  }
}

class Entity {
  constructor() {
    this.pos = new Vector2(0, 0)
    this.vel = new Vector2(0, 0)
  }
}

export default Entity
