import { Trait } from '../Entity.js'

class Walk extends Trait {
  constructor() {
    super(`walk`)

    this.direction = 0
    this.speed = 5000
    this.distance = 0
    this.facing = 1
  }

  update(entity, delta) {
    entity.vel.x = this.speed * this.direction * delta

    if (this.direction) {
      this.facing = this.direction
      this.distance += Math.abs(entity.vel.x) * delta
    } else {
      this.distance = 0
    }
  }
}

export default Walk
