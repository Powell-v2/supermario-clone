`use strict`

const createBackgroundLayer = (lvl, sprites) => {
  const buff = document.createElement(`canvas`)
  const ctx = buff.getContext(`2d`)
  buff.width = 256
  buff.height = 240

  lvl.tiles.forEach((tile, x, y) => {
    sprites.drawTile(tile.name, ctx, x, y)
  })

  return function drawBackgroundLayer(ctx) {
    ctx.drawImage(buff, 0, 0)
  }
}

const createSpriteLayer = (entities) => {
  return function drawSpriteLayer(ctx) {
    entities.forEach((ent) => ent.draw(ctx))
  }
}

export {
  createBackgroundLayer,
  createSpriteLayer,
}
