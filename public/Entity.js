`use strict`
import { Vector2 } from './math.js'

const SIDES = {
  TOP: Symbol(`top`),
  BOTTOM: Symbol(`bottom`),
  LEFT: Symbol(`left`),
  RIGHT: Symbol(`right`),
}

class Trait {
  constructor(name) {
    this.NAME = name
  }

  update() {
    console.warn(`Trait: unhandled update call.`)
  }

  obstruct() {

  }
}

class Entity {
  constructor() {
    this.pos = new Vector2(0, 0)
    this.vel = new Vector2(0, 0)
    this.size = new Vector2(0, 0)

    this.lifetime = 0

    this.traits = []
  }

  addTrait(trait) {
    this.traits.push(trait)
    this[trait.NAME] = trait
  }

  obstruct(side) {
    this.traits.forEach((trait) => trait.obstruct(this, side))
  }

  update(delta) {
    this.traits.forEach((trait) => trait.update(this, delta))

    this.lifetime += delta
  }
}

export {
  Entity as default,
  Trait,
  SIDES,
}
