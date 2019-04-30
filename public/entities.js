`use strict`
import Entity from './Entity.js'
import Velocity from './traits/Velocity.js'
import Jump from './traits/Jump.js'
import Walk from './traits/Walk.js'

import { loadMarioSprite } from './sprites.js'

function createMario() {
  return loadMarioSprite().then((sprite) => {
    const mario = new Entity()

    mario.size.set(14, 16)

    mario.addTrait(new Jump())
    mario.addTrait(new Walk())

    mario.draw = function(ctx) {
      sprite.draw(`idle`, ctx, this.pos.x, this.pos.y)
    }

    return mario
  })
}

export {
  createMario,
}
