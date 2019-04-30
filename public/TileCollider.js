`use strict`
import TileResolver from './TileResolver.js'

class TileCollider {
  constructor(tilesMatrix) {
    this.tiles = new TileResolver(tilesMatrix)
  }

  checkY(entity) {
    const { pos, vel, size } = entity
    const matches = this.tiles.searchByRange(
      pos.x, pos.x + size.x,
      pos.y, pos.y + size.y
    )

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
