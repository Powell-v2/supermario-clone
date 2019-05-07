`use strict`
import Entity from '../Entity.js'
import WiggleWalk from '../traits/WiggleWalk.js'

import { loadSpritesheet } from '../loaders.js'

function createKoopaFactory(sprite) {
  const walkAnim = sprite.animations.get(`walk`)

  function drawKoopa(ctx) {
    const isFlipped = this.vel.x < 0
    sprite.draw(walkAnim(this.lifetime), ctx, 0, 0, isFlipped)
  }

  return function createKoopa() {
    const koopa = new Entity()
    koopa.size.set(16, 16)
    koopa.offset.y = 8
    koopa.lifetime = 0

    koopa.addTrait(new WiggleWalk())

    koopa.draw = drawKoopa

    return koopa
  }
}

async function loadKoopa() {
  const sprite = await loadSpritesheet(`koopa`)

  return createKoopaFactory(sprite)
}

export {
  loadKoopa,
}
