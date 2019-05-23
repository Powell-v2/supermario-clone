`use strict`

class TileResolver {
  constructor(matrix, tileSize = 35) {
    this.matrix = matrix
    this.tileSize = tileSize
  }

  toIndex(pos) {
    return Math.floor(pos / this.tileSize)
  }

  toIndexRange(pos1, pos2) {
    const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize

    let range = []
    let pos = pos1

    do {
      range.push(this.toIndex(pos))
      pos += this.tileSize
    } while (pos < pMax)

    return range
  }

  getByIndex(x, y) {
    const tile = this.matrix.get(x, y)

    if (tile) {
      const yTop = y * this.tileSize
      const yBottom = yTop + this.tileSize
      const xLeft = x * this.tileSize
      const xRight = xLeft + this.tileSize

      return {
        tile,
        xLeft,
        xRight,
        yTop,
        yBottom,
      }
    }
  }

  searchByPosition(x, y) {
    return this.getByIndex(this.toIndex(x), this.toIndex(y))
  }

  searchByRange(x1, x2, y1, y2) {
    let matches = []
    this.toIndexRange(x1, x2).forEach((idxX) => {
      this.toIndexRange(y1, y2).forEach((idxY) => {
        const match = this.getByIndex(idxX, idxY)

        if (match) matches.push(match)
      })
    })

    return matches
  }
}

export default TileResolver
