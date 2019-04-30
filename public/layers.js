`use strict`

const createBackgroundLayer = (lvl, sprites) => {
  const buff = document.createElement(`canvas`)
  const ctx = buff.getContext(`2d`)
  buff.width = 350
  buff.height = 300

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

const createCollisionLayer = (lvl) => {
  let resolvedTiles = []
  const tileResolver = lvl.tileCollider.tiles
  const { tileSize } = tileResolver

  const getByIndexOrig = tileResolver.getByIndex
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y })

    return getByIndexOrig.call(tileResolver, x, y)
  }

  return function drawCollision(ctx) {
    ctx.strokeStyle = `green`
    resolvedTiles.forEach(({ x, y }) => {
      ctx.beginPath()
      ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize)
    })
    ctx.stroke()

    resolvedTiles.length = 0
  }
}

export {
  createBackgroundLayer,
  createSpriteLayer,
  createCollisionLayer,
}
