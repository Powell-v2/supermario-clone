`use strict`

class TileResolver {
  constructor(matrix, tileSize = 16) {
    this.matrix = matrix
    this.tileSize = tileSize
  }

  toIndex(pos) {
    return Math.floor(pos / this.tileSize)
  }

  getByIndex(x, y) {
    const tile = this.matrix.get(x, y)

    if (tile) {
      const yTop = y * this.tileSize
      const yBottom = yTop + this.tileSize

      return {
        tile,
        yTop,
        yBottom,
      }
    }
  }

  matchByPosition(x, y) {
    return this.getByIndex(this.toIndex(x), this.toIndex(y))
  }
}

export default TileResolver
