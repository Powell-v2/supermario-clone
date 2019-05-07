`use strict`
import Entity from '../Entity.js'
import Jump from '../traits/Jump.js'
import Run from '../traits/Run.js'

import { loadSpritesheet } from '../loaders.js'

const DRAG_TURBO = 1/5000
const DRAG_NORMAL = 1/1500

function createMarioFactory(sprite) {
  function routeFrame(mario) {
    const runAnimation = sprite.animations.get(`run`)

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

  function drawSprite(ctx) {
    const isFlipped = (this.run.facing === -1) ? true : false
    sprite.draw(routeFrame(this), ctx, 0, 0, isFlipped)
  }

  function setTurboState(isTurboOn) {
    this.run.dragFactor = isTurboOn ? DRAG_TURBO : DRAG_NORMAL
  }

  return function createMario() {
    const mario = new Entity()
    mario.addTrait(new Jump())
    mario.addTrait(new Run())
    mario.size.set(14, 16)

    routeFrame(mario)

    mario.draw = drawSprite
    mario.turbo = setTurboState

    return mario
  }
}

async function loadMario() {
  const sprite = await loadSpritesheet(`mario`)

  return createMarioFactory(sprite)
}

export {
  loadMario,
}
