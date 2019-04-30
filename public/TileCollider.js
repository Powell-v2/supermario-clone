`use strict`
import TileResolver from './TileResolver.js'

class TileCollider {
  constructor(tilesMatrix) {
    this.tiles = new TileResolver(tilesMatrix)
  }

  checkY(entity) {
    const { pos, vel } = entity
    const match = this.tiles.matchByPosition(pos.x, pos.y)

    if (!match) return
    if (match.tile.name !== `ground`) return

    if (vel.y > 0) {
      if (pos.y > match.yTop) {
        pos.y = match.yTop
        vel.y = 0
      }
    }
    else if (vel.y < 0) {
      if (pos.y < match.yBottom) {
        pos.y = match.yBottom
        vel.y = 0
      }
    }
  }
}

export default TileCollider
