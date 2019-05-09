`use strict`

export default class EntityCollider {
  constructor(entities) {
    this.entities = entities
  }

  check(subject) {
    this.entities.forEach((ent) => {
      if (subject === ent) return

      if (subject.bounds.overlaps(ent.bounds)) {
        subject.collides(ent)
        ent.collides(subject)
      }
    })
  }
}
