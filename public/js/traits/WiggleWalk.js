import { Trait, SIDES } from '../Entity.js'

class WiggleWalk extends Trait {
  constructor() {
    super(`wiggleWalk`)

    this.speed = -50
  }

  obstruct(_koopa, side) {
    if (side === SIDES.LEFT || side === SIDES.RIGHT) {
      this.speed = -this.speed
    }
  }

  update(entity, delta) {
    entity.vel.x = this.speed
  }
}

export default WiggleWalk
