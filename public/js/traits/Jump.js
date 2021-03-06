import AudioControls from '../AudioControls.js'
import { Trait, SIDES } from '../Entity.js'

class Jump extends Trait {
  constructor() {
    super(`jump`)

    // HACK:
    // Use number instead of bool to avoid drawing jump frame
    // when being sandwitched between 2 tiles.
    this.isReady = 0
    // Max jump duration.
    this.duration = 0.3
    this.velocity = 350
    this.engagedTime = 0
    this.requestTime = 0
    // Allow for initiating a jump again without hitting the ground.
    this.gracePeriod = 0.1
    this.speedBoost = 0.22

    this.audioControls = new AudioControls()
  }

  get isFalling() {
    return this.isReady < 0
  }

  start() {
    this.requestTime = this.gracePeriod
  }

  cancel() {
    this.engagedTime = 0
    this.requestTime = 0
  }

  obstruct(_entity, side) {
    if (side === SIDES.BOTTOM) this.isReady = 1
    if (side === SIDES.TOP) this.cancel()
  }

  update(entity, delta) {
    if (this.requestTime > 0) {
      if (this.isReady > 0) {
        this.audioControls.play(`jump`)
        this.engagedTime = this.duration
        this.requestTime = 0
      }

      this.requestTime -= delta
    }

    if (this.engagedTime > 0) {
      const increaseJumpBy = Math.abs(entity.vel.x * this.speedBoost)

      entity.vel.y = -(this.velocity + increaseJumpBy)

      this.engagedTime -= delta
    }

    this.isReady -= 1
  }
}

export default Jump
