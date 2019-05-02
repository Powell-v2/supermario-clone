`use strict`
import Entity from './Entity.js'
import Jump from './traits/Jump.js'
import Run from './traits/Run.js'

import { loadSpritesheet } from './loaders.js'
import { createAnimation } from './animation.js'

const DRAG_TURBO = 1/5000
const DRAG_NORMAL = 1/1500

async function createMario() {
  const sprite = await loadSpritesheet(`mario`)
  const mario = new Entity()

  mario.size.set(14, 16)

  mario.addTrait(new Jump())
  mario.addTrait(new Run())

  const runAnimation = createAnimation([`run_1`, `run_2`, `run_3`], 9)

  function routeFrame(mario) {
    if (mario.jump.isFalling) return `jump`

    if (mario.run.distance > 0) {
      if (
        (mario.vel.x > 0) && (mario.run.direction < 0) ||
        (mario.vel.x < 0) && (mario.run.direction > 0)
      ) {
        return `skid`
      }
      return runAnimation(mario.run.distance)
    }

    return `idle`
  }

  mario.draw = function(ctx) {
    const isFlipped = (this.run.facing === -1) ? true : false
    sprite.draw(routeFrame(this), ctx, 0, 0, isFlipped)
  }

  mario.turbo = function setTurboState(isTurboOn) {
    this.run.dragFactor = isTurboOn ? DRAG_TURBO : DRAG_NORMAL
  }

  return mario
}

export {
  createMario,
}
