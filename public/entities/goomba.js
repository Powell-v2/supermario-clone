`use strict`
import Entity, { SIDES } from '../Entity.js'

import { loadSpritesheet } from '../loaders.js'

function createGoombaFactory(sprite) {
  const walkAnim = sprite.animations.get(`walk`)

  function drawSprite(ctx) {
    console.log(this)
    sprite.draw(walkAnim(this.lifetime), ctx, 0, 0)
  }

  return function createGoomba() {
    const goomba = new Entity()
    goomba.size.set(16, 16)
    goomba.lifetime = 0

    goomba.addTrait({
      NAME: `walk`,
      speed: 50,
      obstruct(_goomba, side) {
        if (side === SIDES.LEFT || side === SIDES.RIGHT) {
          this.speed = -this.speed
        }
      },
      update(goomba) {
        goomba.vel.x = this.speed
      }
    })

    goomba.draw = drawSprite

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
