`use strict`
import Entity from './Entity.js'

import { loadMarioSprite } from './sprites.js'

function createMario() {
  return loadMarioSprite().then((sprite) => {
    const mario = new Entity()
    mario.pos.set(64, 180)
    mario.vel.set(2, -10)

    mario.draw = function(ctx) {
      sprite.draw(`idle`, ctx, this.pos.x, this.pos.y)
    }

    mario.update = function(delta) {
      this.pos.x += this.vel.x * delta
      this.pos.y += this.vel.y * delta
    }

    return mario
  })
}

export {
  createMario,
}
