import { Trait } from '../Entity.js'

export default class Stomp extends Trait {
  constructor() {
    super(`stomp`)

    this.queueBounce = false
    this.bounceSpeed = 350
  }

  bounce() {
    this.queueBounce = true
  }

  update(ent) {
    if (this.queueBounce) {
      ent.vel.y = -this.bounceSpeed
      this.queueBounce = false
    }
  }
}
