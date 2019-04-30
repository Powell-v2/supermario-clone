`use strict`
import Entity from './Entity.js'
import Velocity from './traits/Velocity.js'
import Jump from './traits/Jump.js'

import { loadMarioSprite } from './sprites.js'

function createMario() {
  return loadMarioSprite().then((sprite) => {
    const mario = new Entity()

    mario.addTrait(new Jump())
    mario.addTrait(new Velocity())

    mario.draw = function(ctx) {
      sprite.draw(`idle`, ctx, this.pos.x, this.pos.y)
    }

    return mario
  })
}

export {
  createMario,
}
