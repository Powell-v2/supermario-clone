`use strict`

class Matrix {
  constructor() {
    this.grid = []
  }

  forEach(cb) {
    this.grid.forEach((col, x) =>
      col.forEach((val, y) => cb(val, x, y))
    )
  }

  get(x, y) {
    const col = this.grid[x]

    if (col) return col[y]
  }

  set(x, y, val) {
    if (!this.grid[x]) this.grid[x] = []

    this.grid[x][y] = val
  }
}

export {
  Matrix,
}
