`use strict`
import Entity, { SIDES } from '../Entity.js'
import WiggleWalk from '../traits/WiggleWalk.js'

import { loadSpritesheet } from '../loaders.js'

function createGoombaFactory(sprite) {
  const walkAnim = sprite.animations.get(`walk`)

  function drawGoomba(ctx) {
    sprite.draw(walkAnim(this.lifetime), ctx, 0, 0)
  }

  return function createGoomba() {
    const goomba = new Entity()
    goomba.size.set(16, 16)
    goomba.lifetime = 0

    goomba.addTrait(new WiggleWalk())

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
