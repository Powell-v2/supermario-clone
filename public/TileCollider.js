`use strict`
import TileResolver from './TileResolver.js'
import { SIDES } from './Entity.js'

class TileCollider {
  constructor(collisionMatrix) {
    this.tiles = new TileResolver(collisionMatrix)
  }

  checkX(entity) {
    let x

    if (entity.vel.x > 0) x = entity.bounds.right
    else if (entity.vel.x < 0) x = entity.bounds.left
    else return

    const matches = this.tiles.searchByRange(
      x, x,
      entity.bounds.top,
      entity.bounds.bottom
    )

    matches.forEach((match) => {
      // Skip non-blocking types.
      if (match.tile.type !== `ground`) return

      // Check for collision on the right side.
      if (entity.vel.x > 0) {
        if (entity.bounds.right > match.xLeft) {
          entity.bounds.left = match.xLeft - entity.size.x
          entity.vel.x = 0
        }

        entity.obstruct(SIDES.RIGHT)
      }
      // Check for collision on the left side.
      else if (entity.vel.x < 0) {
        if (entity.bounds.left < match.xRight) {
          entity.bounds.left = match.xRight
          entity.vel.x = 0
        }

        entity.obstruct(SIDES.LEFT)
      }
    })
  }

  checkY(entity, interactionGrid) {
    let y

    if (entity.vel.y > 0) y = entity.bounds.bottom
    else if (entity.vel.y < 0) y = entity.bounds.top
    else return

    const matches = this.tiles.searchByRange(
      entity.bounds.left, entity.bounds.right,
      y, y
    )

    matches.forEach((match) => {
      // Skip non-blocking types.
      if (match.tile.type !== `ground`) return

      // Check for collision below.
      if (entity.vel.y > 0) {
        if (entity.bounds.bottom > match.yTop) {
          entity.bounds.top = match.yTop - entity.size.y
          entity.vel.y = 0

          entity.obstruct(SIDES.BOTTOM)
        }
      }
      // Check for collision above.
      else if (entity.vel.y < 0) {
        if (entity.bounds.top < match.yBottom) {
          entity.bounds.top = match.yBottom
          entity.vel.y = 0

          entity.obstruct(SIDES.TOP)

          if (match.tile.destroyable) {
            const x = this.tiles.toIndex(match.xLeft)
            const y = this.tiles.toIndex(match.yTop)
            interactionGrid.set(x, y, {
              ...match.tile,
              remove: true,
              touchedAt: performance.now()
            })
            this.tiles.matrix.replaceOne(x, y, { name: `sky` })
          }
        }
      }
    })
  }
}

export default TileCollider
