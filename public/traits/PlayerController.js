import { Trait } from '../Entity.js'
import { Vector2 } from '../math.js'

export default class PlayerController extends Trait {
  constructor() {
    super(`playerController`)

    this.player = null
    this.checkpoint = new Vector2(0, 0)
  }

  setPlayer(ent) {
    this.player = ent
  }

  update(_ent, _delta, lvl) {
    if (!lvl.entities.has(this.player)) {
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y)
      this.player.killable.revive()

      lvl.entities.add(this.player)
    }
  }
}
