`use strict`
import Entity from '../Entity.js'
import Jump from '../traits/Jump.js'
import Run from '../traits/Run.js'
import Stomp from '../traits/Stomp.js'
import Killable from '../traits/Killable.js'

import { loadSpritesheet } from '../loaders.js'

const DRAG_TURBO = 1/5000
const DRAG_NORMAL = 1/1500

function createHeroFactory(sprite) {
  function routeFrame(hero) {
    const runAnimation = sprite.animations.get(`run`)

    if (hero.jump.isFalling) return `jump`

    if (hero.run.distance > 0) {
      if (
        (hero.vel.x > 0) && (hero.run.direction < 0) ||
        (hero.vel.x < 0) && (hero.run.direction > 0)
      ) {
        return `skid`
      }
      return runAnimation(hero.run.distance)
    }

    return `idle`
  }

  function drawHero(ctx) {
    const isFlipped = (this.run.facing === -1) ? true : false
    sprite.draw(routeFrame(this), ctx, 0, 0, isFlipped)
  }

  function setTurboState(isTurboOn) {
    this.run.dragFactor = isTurboOn ? DRAG_TURBO : DRAG_NORMAL
  }

  return function createHero() {
    const hero = new Entity()
    hero.addTrait(new Jump())
    hero.addTrait(new Run())
    hero.addTrait(new Stomp())
    hero.addTrait(new Killable())
    hero.size.set(16, 32)
    hero.killable.removeAfter = 0

    routeFrame(hero)

    hero.draw = drawHero
    hero.turbo = setTurboState

    return hero
  }
}

async function loadHero(name) {
  const sprite = await loadSpritesheet(name)

  return createHeroFactory(sprite)
}

export {
  loadHero,
}
