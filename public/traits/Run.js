import { Trait } from '../Entity.js'

class Run extends Trait {
  constructor() {
    super(`run`)

    this.direction = 0
    this.acceleration = 500
    this.deceleration = 250
    this.dragFactor = 1/5000
    // Total distance covered.
    this.distance = 0
    // Current direction the entity is facing.
    this.facing = 1
  }

  update(entity, delta) {
    const absX = Math.abs(entity.vel.x)

    // Build up velocity while moving.
    if (this.direction !== 0) {
      entity.vel.x += (this.acceleration * delta) * this.direction

      this.facing = this.direction
    }
    // Reduce velocity if not currently moving (button is released).
    else if (entity.vel.x !== 0) {
      const reduceBy = Math.min(absX, this.deceleration * delta)

      entity.vel.x += (entity.vel.x > 0) ? -reduceBy : reduceBy
    }
    // Reset distance counter when stopped.
    else {
      this.distance = 0
    }

    // Limit max running speed.
    const drag = this.dragFactor * entity.vel.x * absX
    entity.vel.x -= drag

    this.distance += absX * delta
  }
}

export default Run
