`use strict`
import TileResolver from './TileResolver.js'

class TileCollider {
  constructor(tilesMatrix) {
    this.tiles = new TileResolver(tilesMatrix)
  }

  checkX(entity) {
    let x

    const { pos, vel, size } = entity

    if (vel.x > 0) {
      x = pos.x + size.x
    }
    else if (vel.x < 0) {
      x = pos.x
    }
    else return

    const matches = this.tiles.searchByRange(x, x, pos.y, pos.y + size.y)

    matches.forEach((match) => {
      if (match.tile.name !== `ground`) return

      if (vel.x > 0) {
        if (pos.x + size.x > match.xLeft) {
          pos.x = match.xLeft - size.x
          vel.x = 0
        }
      }
      else if (vel.x < 0) {
        if (pos.x < match.xRight) {
          pos.x = match.xRight
          vel.x = 0
        }
      }
    })
  }

  checkY(entity) {
    let y

    const { pos, vel, size } = entity

    if (vel.y > 0) {
      y = pos.y + size.y
    }
    else if (vel.y < 0) {
      y = pos.y
    }
    else return

    const matches = this.tiles.searchByRange(pos.x, pos.x + size.x, y, y)

    matches.forEach((match) => {
      if (match.tile.name !== `ground`) return

      if (vel.y > 0) {
        if (pos.y + size.y > match.yTop) {
          pos.y = match.yTop - size.y
          vel.y = 0
        }
      }
      else if (vel.y < 0) {
        if (pos.y < match.yBottom) {
          pos.y = match.yBottom
          vel.y = 0
        }
      }
    })
  }
}

export default TileCollider
