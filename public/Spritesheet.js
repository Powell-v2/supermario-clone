`use strict`

class Spritesheet {
  constructor(img, width, height) {
    this.img = img
    this.width = width
    this.height = height
    this.tileset = new Map()
  }

  define(name, x, y, width, height) {
    const buffs = [true, false].map((isFlipped) => {
      const buff = document.createElement(`canvas`)
      const buffCtx = buff.getContext(`2d`)
      buff.width = width
      buff.height = height

      if (isFlipped) {
        buffCtx.scale(-1, 1)
        buffCtx.translate(-width, 0)
      }

      buffCtx.drawImage(
        this.img,
        x, y,
        width, height,
        0, 0,
        width, height,
      )

      return buff
    })

    this.tileset.set(name, buffs)
  }

  defineTile(name, x, y) {
    this.define(name, x * this.width, y * this.height, this.width, this.height)
  }

  draw(name, ctx, x, y, isFlipped = false) {
    const buffer = this.tileset.get(name)[isFlipped ? 0 : 1]
    ctx.drawImage(buffer, x, y)
  }

  drawTile(name, ctx, x, y) {
    const buffer = this.tileset.get(name)[1]
    ctx.drawImage(buffer, x * this.width, y * this.height)
  }
}

export default Spritesheet
