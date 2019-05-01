`use strict`
import Entity from './Entity.js'
import Jump from './traits/Jump.js'
import Walk from './traits/Walk.js'

import { loadSpritesheet } from './loaders.js'
import { createAnimation } from './animation.js'

async function createMario() {
  const sprite = await loadSpritesheet(`mario`)
  const mario = new Entity()

  mario.size.set(14, 16)

  mario.addTrait(new Jump())
  mario.addTrait(new Walk())

  const runAnimation = createAnimation([`run_1`, `run_2`, `run_3`], 10)

  function routeFrame(mario) {
    if (mario.walk.direction !== 0) {
      return runAnimation(mario.walk.distance)
    }

    return `idle`
  }

  mario.draw = function(ctx) {
    const isFlipped = (this.walk.facing === -1) ? true : false
    sprite.draw(routeFrame(this), ctx, 0, 0, isFlipped)
  }

  return mario
}

export {
  createMario,
}
