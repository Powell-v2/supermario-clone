`use strict`
import BoundingBox from './BoundingBox.js'

import { Vector2 } from './math.js'

const SIDES = {
  TOP: Symbol(`top`),
  BOTTOM: Symbol(`bottom`),
  LEFT: Symbol(`left`),
  RIGHT: Symbol(`right`),
}

class Entity {
  constructor() {
    this.pos = new Vector2(0, 0)
    this.vel = new Vector2(0, 0)
    this.size = new Vector2(0, 0)
    this.offset = new Vector2(0, 0)
    this.bounds = new BoundingBox(this.pos, this.size, this.offset)

    this.lifetime = 0

    this.traits = []

    this.controls = null
  }

  addTrait(trait) {
    this.traits.push(trait)
    this[trait.NAME] = trait
  }

  collides(subject) {
    this.traits.forEach((trait) => trait.collides(this, subject))
  }

  draw() {}

  obstruct(side) {
    this.traits.forEach((trait) => trait.obstruct(this, side))
  }

  update(delta, lvl) {
    this.traits.forEach((trait) => trait.update(this, delta, lvl))

    this.lifetime += delta
  }
}

class Trait {
  constructor(name) {
    this.NAME = name
  }

  collides(_us, _them) {}

  obstruct() {}

  update() {}
}

export {
  Entity as default,
  Trait,
  SIDES,
}
