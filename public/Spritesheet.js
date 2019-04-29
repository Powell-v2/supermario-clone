`use strict`
class Spritesheet {
  constructor(img, width, height) {
    this.img = img
    this.width = width
    this.height = height
    this.tileset = new Map()
  }

  define(name, x, y, width, height) {
    const buffer = document.createElement(`canvas`)

    buffer.width = width
    buffer.height = height

    buffer
      .getContext(`2d`)
      .drawImage(
        this.img,
        x, y,
        width, height,
        0, 0,
        width, height,
      )

    this.tileset.set(name, buffer)
  }

  defineTile(name, x, y) {
    this.define(name, x * this.width, y * this.height, this.width, this.height)
  }

  draw(name, ctx, x, y) {
    const buffer = this.tileset.get(name)
    ctx.drawImage(buffer, x, y)
  }

  drawTile(name, ctx, x, y) {
    const buffer = this.tileset.get(name)
    ctx.drawImage(buffer, x * this.width, y * this.height)
  }
}

export default Spritesheet
