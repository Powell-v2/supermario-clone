`use strict`
import { Vector2 } from './math.js'

class Trait {
  constructor(name) {
    this.NAME = name
  }

  update() {
    console.warn(`Trait: unhandled update call.`)
  }
}

class Entity {
  constructor() {
    this.pos = new Vector2(0, 0)
    this.vel = new Vector2(0, 0)
    this.size = new Vector2(0, 0)

    this.traits = []
  }

  addTrait(trait) {
    this.traits.push(trait)
    this[trait.NAME] = trait
  }

  update(delta) {
    this.traits.forEach((trait) => trait.update(this, delta))
  }
}

export {
  Entity as default,
  Trait,
}
