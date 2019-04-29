class Spritesheet {
  constructor(img, width, height) {
    this.img = img
    this.width = width
    this.height = height
    this.tileset = new Map()
  }

  define(name, x, y) {
    const buffer = document.createElement(`canvas`)

    buffer.width = this.width
    buffer.height = this.height

    buffer
      .getContext(`2d`)
      .drawImage(
        this.img,
        x * this.width, y * this.height,
        this.width, this.height,
        0, 0,
        this.width, this.height,
      )

    this.tileset.set(name, buffer)
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
