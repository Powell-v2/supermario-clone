`use strict`
import { Trait } from '../Entity.js'

import { Vector2 } from '../utils/math.js'

export default class PlayerController extends Trait {
  constructor() {
    super(`playerController`)

    this.player = null
    this.checkpoint = new Vector2(0, 0)
  }

  setPlayer(player) {
    this.player = player
  }

  update(_entity, _delta, lvl) {
    if (!lvl.entities.has(this.player)) {
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y)
      this.player.killable.revive()

      lvl.entities.add(this.player)
    }

    if (this.player.pos.y >= 350 && this.player.killable) {
      this.player.killable.kill()

      lvl.reset()
    }

    if (this.player.hasReachedEnd) {
      this.player.jump.start()
    }
  }
}
