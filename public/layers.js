`use strict`
const drawBackground = (bg, ctx, sprites) => {
  bg.ranges.forEach(({ x: [x1, x2], y: [y1, y2] }) => {
    for (let x = x1; x < x2; x += 1) {
      for (let y = y1; y < y2; y += 1) {
        sprites.drawTile(bg.tile, ctx, x, y)
      }
    }
  })
}

const createBackgroundLayer = (backgrounds, sprites) => {
  const buff = document.createElement(`canvas`)
  buff.width = 256
  buff.height = 240

  backgrounds.forEach((bg) => {
    drawBackground(bg, buff.getContext(`2d`), sprites)
  })

  return function drawBackgroundLayer(ctx) {
    ctx.drawImage(buff, 0, 0)
  }
}

const createSpriteLayer = (entity) => {
  return function drawSpriteLayer(ctx) {
    entity.draw(ctx)
  }
}

export {
  createBackgroundLayer,
  createSpriteLayer,
}
