`use strict`

const createBackgroundLayer = (lvl, sprites) => {
  const buff = document.createElement(`canvas`)
  const ctx = buff.getContext(`2d`)
  buff.width = 4096
  buff.height = 300

  lvl.tiles.forEach((tile, x, y) => {
    sprites.drawTile(tile.name, ctx, x, y)
  })

  return function drawBackgroundLayer(ctx, cam) {
    ctx.drawImage(buff, -cam.pos.x, -cam.pos.y)
  }
}

const createSpriteLayer = (entities, width = 64, height = 64) => {
  const spriteBuff = document.createElement(`canvas`)
  const spriteBuffCtx = spriteBuff.getContext(`2d`)

  spriteBuff.width = width
  spriteBuff.height = height

  return function drawSpriteLayer(ctx, cam) {
    entities.forEach((ent) => {
      spriteBuffCtx.clearRect(0, 0, width, height)

      ent.draw(spriteBuffCtx)

      ctx.drawImage(
        spriteBuff,
        ent.pos.x - cam.pos.x, ent.pos.y - cam.pos.y
      )
    })
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

  return function drawCollision(ctx, cam) {
    ctx.strokeStyle = `green`
    resolvedTiles.forEach(({ x, y }) => {
      ctx.beginPath()
      ctx.rect(
        x * tileSize - cam.pos.x,
        y * tileSize - cam.pos.y,
        tileSize,
        tileSize
      )
      ctx.stroke()
    })

    ctx.strokeStyle = `red`
    lvl.entities.forEach(({ pos, size }) => {
      ctx.beginPath()
      ctx.rect(
        pos.x - cam.pos.x,
        pos.y - cam.pos.y,
        size.x,
        size.y
      )
      ctx.stroke()
    })

    resolvedTiles.length = 0
  }
}

export {
  createBackgroundLayer,
  createSpriteLayer,
  createCollisionLayer,
}
