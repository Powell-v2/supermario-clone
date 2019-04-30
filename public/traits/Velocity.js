import { Trait } from '../Entity.js'

class Velocity extends Trait {
  constructor() {
    super(`velocity`)
  }

  update(entity, delta) {
    const { pos, vel } = entity
    pos.x += vel.x * delta
    pos.y += vel.y * delta
  }
}

export default Velocity
