`use strict`

const createCollisionLayer = (lvl) => {
  let resolvedTiles = []
  const tileResolver = lvl.tileCollider.tiles
  const { tileSize } = tileResolver

  const getByIndexOrig = tileResolver.getByIndex
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y })

    return getByIndexOrig.call(tileResolver, x, y)
  }

  return function drawCollisionRects(ctx, cam) {
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
    lvl.entities.forEach(({ bounds, size }) => {
      ctx.beginPath()
      ctx.rect(
        bounds.left - cam.pos.x,
        bounds.top - cam.pos.y,
        size.x,
        size.y
      )
      ctx.stroke()
    })

    resolvedTiles.length = 0
  }
}

export default createCollisionLayer
