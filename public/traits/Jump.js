import { Trait } from '../Entity.js'

class Jump extends Trait {
  constructor() {
    super(`jump`)

    this.duration = 0.5
    this.velocity = 175
    this.engagedTime = 0
  }

  start() {
    this.engagedTime = this.duration
  }

  cancel() {
    this.engagedTime = 0
  }

  update(entity, delta) {
    if (this.engagedTime > 0) {
      entity.vel.y = -this.velocity
      this.engagedTime -= delta
    }
  }
}

export default Jump
