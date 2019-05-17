import AudioControls from '../AudioControls.js'
import { Trait } from '../Entity.js'

export default class Killable extends Trait {
  constructor() {
    super(`killable`)

    this.dead = false
    this.deadTime = 0
    this.removeAfter = 1.5

    this.audioControls = new AudioControls()
  }

  kill() {
    this.dead = true

    this.audioControls.play(`die`)
  }

  revive() {
    this.dead = false
    this.deadTime = 0
  }

  update(entity, delta, lvl) {
    if (this.dead) {
      this.deadTime += delta

      if (this.deadTime >= this.removeAfter) {
        lvl.entities.delete(entity)
      }
    }
  }
}
