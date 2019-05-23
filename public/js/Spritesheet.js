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

      if (name === `coin`) {
        buffCtx.scale(0.75, 0.75)
        buffCtx.translate(width * 0.75 * (1 - 0.75), height * 0.75 * (1 - 0.75))
      }

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
    const buff = this.tileset.get(name)[isFlipped ? 0 : 1]
    ctx.drawImage(buff, x, y)
  }

  drawTile(name, ctx, x, y) {
    const buff = this.tileset.get(name)[1]
    ctx.drawImage(buff, x * this.width, y * this.height)
  }

  drawAnimation(name, ctx, x, y, distance) {
    const animation = this.animations.get(name)
    this.drawTile(animation(distance), ctx, x, y)
  }

  extractCoin(name, ctx, idxX, idxY, delta) {
    const tile = this.tileset.get(name)[1]
    const coin = this.tileset.get(`coin`)[1]
    const posX = idxX * this.width
    const posY = idxY * this.height
    delta *= 35

    ctx.drawImage(tile, posX, Math.min(posY, posY + delta**2 - delta * 8))
    if ((posY - this.height + delta**2 - delta * 20) < posY - this.height) {
      ctx.drawImage(coin, posX, Math.min(posY - this.height, posY - this.height + delta**2 - delta * 20))
    }
  }

  drawShards(name, ctx, size, idxX, idxY, delta) {
    const buff = this.tileset.get(name)[1]
    const shardW = this.width / size
    const shardH = this.height / size
    const mult = 2.5

    for (let sc = 0; sc < size; sc += 1) {
      const isLeftHalf = sc < size / 2
      // TODO: Find multiplier for c to properly offset columns
      const posX = (idxX + (isLeftHalf ? -delta : delta)) * this.width

      for (let sr = 0; sr < size; sr += 1) {
        const posY = (idxY + (delta**2 - delta * (mult - 0.5 * sr))) * this.height
        const sx = shardW * sc
        const sy = shardH * sr
        const dx = posX + shardW * sc
        const dy = posY + shardH * sr

        // TODO: Find a way to rotate individual shards
        ctx.drawImage(
          buff,
          sx, sy,
          // sW, sH
          shardW, shardH,
          dx, dy,
          // dW, dH
          shardW, shardH
        )
      }
    }
  }
}

export default Spritesheet
