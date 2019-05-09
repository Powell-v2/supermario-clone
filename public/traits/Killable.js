import { Trait } from '../Entity.js'

export default class Killable extends Trait {
  constructor() {
    super(`killable`)

    this.dead = false
    this.deadTime = 0
    this.removeAfter = 1.5
  }

  kill() {
    this.dead = true
  }

  revive() {
    this.dead = false
    this.deadTime = 0
  }

  update(ent, delta, lvl) {
    if (this.dead) {
      this.deadTime += delta

      if (this.deadTime >= this.removeAfter) {
        lvl.entities.delete(ent)
      }
    }
  }
}
