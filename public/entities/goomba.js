`use strict`
import Entity, { Trait } from '../Entity.js'
import WiggleWalk from '../traits/WiggleWalk.js'
import Killable from '../traits/Killable.js'

import { loadSpritesheet } from '../loaders.js'

class Behaviour extends Trait {
  constructor() {
    super(`behaviour`)
  }

  collides(us, them) {
    if (us.killable.dead) return

    if (them.stomp) {
      // Kill goomba only when hero stomps over.
      if (them.vel.y > us.vel.y) {
        us.killable.kill()
        us.wiggleWalk.speed = 0

        them.stomp.bounce()
      }
      // Kill hero otherwise.
      else {
        them.killable.kill()
      }
    }
  }
}

function createGoombaFactory(sprite) {
  function routeFrame(goomba) {
    const walkAnimation = sprite.animations.get(`walk`)

    if (goomba.killable.dead) {
      return `flat`
    }

    return walkAnimation(goomba.lifetime)
  }

  function drawGoomba(ctx) {
    sprite.draw(routeFrame(this), ctx, 0, 0)
  }

  return function createGoomba() {
    const goomba = new Entity()
    goomba.size.set(16, 16)
    goomba.lifetime = 0

    goomba.addTrait(new WiggleWalk())
    goomba.addTrait(new Behaviour())
    goomba.addTrait(new Killable())

    goomba.draw = drawGoomba

    return goomba
  }
}

async function loadGoomba() {
  const sprite = await loadSpritesheet(`goomba`)

  return createGoombaFactory(sprite)
}

export {
  loadGoomba,
}
