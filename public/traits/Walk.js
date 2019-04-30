import { Trait } from '../Entity.js'

class Walk extends Trait {
  constructor() {
    super(`walk`)

    this.direction = 0
    this.speed = 5000
  }

  update(entity, delta) {
    entity.vel.x = this.speed * this.direction * delta
  }
}

export default Walk
