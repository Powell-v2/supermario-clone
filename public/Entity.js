`use strict`
class Vector2 {
  constructor(x, y) {
    this.set(x, y)
  }

  set(x, y) {
    this.x = x
    this.y = y
  }
}

export class Trait {
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

export default Entity
