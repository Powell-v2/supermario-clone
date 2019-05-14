`use strict`

class Spritesheet {
  constructor(img, width, height) {
    this.img = img
    this.width = width
    this.height = height
    this.tileset = new Map()
    this.animations = new Map()
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

  defineAnimation(name, anim) {
    this.animations.set(name, anim)
  }

  draw(name, ctx, x, y, isFlipped = false) {
    const buffer = this.tileset.get(name)[isFlipped ? 0 : 1]
    ctx.drawImage(buffer, x, y)
  }

  drawTile(name, ctx, x, y) {
    const buff = this.tileset.get(name)[1]
    ctx.drawImage(buff, x * this.width, y * this.height)
  }

  drawShards(ctx, buff, size, idxX, idxY, delta) {
    const width = this.width / size
    const height = this.height / size
    const mult = 2.5

    for (let sc = 0; sc < size; sc += 1) {
      const isLeftHalf = sc < size / 2
      // TODO: Find multiplier for c to properly offset columns
      const toX = (idxX + (isLeftHalf ? -delta : delta)) * this.width

      for (let sr = 0; sr < size; sr += 1) {
        const toY = (idxY + (delta**2 - delta * (mult - 0.5 * sr))) * this.height
        const sx = width * sc
        const sy = height * sr
        const dx = toX + width * sc
        const dy = toY + height * sr

        // TODO: Find a way to rotate individual shards
        ctx.drawImage(
          buff,
          sx, sy,
          // sW, sH
          width, height,
          dx, dy,
          // dW, dH
          width, height
        )
      }
    }
  }

  shredTile(name, ctx, idxX, idxY, delta) {
    const buff = this.tileset.get(name)[1]
    this.drawShards(ctx, buff, 2, idxX, idxY, delta)
  }

  drawAnimation(name, ctx, x, y, distance) {
    const animation = this.animations.get(name)
    this.drawTile(animation(distance), ctx, x, y)
  }
}

export default Spritesheet
