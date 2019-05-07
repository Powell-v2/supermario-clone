`use strict`
import TileResolver from './TileResolver.js'
import { SIDES } from './Entity.js'

class TileCollider {
  constructor(tilesMatrix) {
    this.tiles = new TileResolver(tilesMatrix)
  }

  checkX(entity) {
    let x

    if (entity.vel.x > 0) x = entity.pos.x + entity.size.x
    else if (entity.vel.x < 0) x = entity.pos.x
    else return

    const matches = this.tiles.searchByRange(
      x, x,
      entity.pos.y,
      entity.pos.y + entity.size.y
    )

    matches.forEach((match) => {
      // Skip non-blocking types.
      if (match.tile.type !== `ground`) return

      // Check for collision on the right side.
      if (entity.vel.x > 0) {
        if (entity.pos.x + entity.size.x > match.xLeft) {
          entity.pos.x = match.xLeft - entity.size.x
          entity.vel.x = 0
        }

        entity.obstruct(SIDES.RIGHT)
      }
      // Check for collision on the left side.
      else if (entity.vel.x < 0) {
        if (entity.pos.x < match.xRight) {
          entity.pos.x = match.xRight
          entity.vel.x = 0
        }

        entity.obstruct(SIDES.LEFT)
      }
    })
  }

  checkY(entity) {
    let y

    if (entity.vel.y > 0) y = entity.pos.y + entity.size.y
    else if (entity.vel.y < 0) y = entity.pos.y
    else return

    const matches = this.tiles.searchByRange(
      entity.pos.x, entity.pos.x + entity.size.x,
      y, y
    )

    matches.forEach((match) => {
      // Skip non-blocking types.
      if (match.tile.type !== `ground`) return

      // Check for collision below.
      if (entity.vel.y > 0) {
        if (entity.pos.y + entity.size.y > match.yTop) {
          entity.pos.y = match.yTop - entity.size.y
          entity.vel.y = 0

          entity.obstruct(SIDES.BOTTOM)
        }
      }
      // Check for collision above.
      else if (entity.vel.y < 0) {
        if (entity.pos.y < match.yBottom) {
          entity.pos.y = match.yBottom
          entity.vel.y = 0

          entity.obstruct(SIDES.TOP)
        }
      }
    })
  }
}

export default TileCollider
