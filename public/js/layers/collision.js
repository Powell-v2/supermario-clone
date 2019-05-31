`use strict`

const createEntityLayer = (entities) => {
  return function drawBoundingBox(ctx, cam) {
    ctx.strokeStyle = `red`
    entities.forEach(({ bounds, size }) => {
      ctx.beginPath()
      ctx.rect(
        bounds.left - cam.pos.x,
        bounds.top - cam.pos.y,
        size.x,
        size.y
      )
      ctx.stroke()
    })
  }
}

const createTileCandidateLayer = (tileCollider) => {
  let resolvedTiles = []
  const tileResolver = tileCollider.collisionGrid
  const { tileSize } = tileResolver

  const getByIndexOrig = tileResolver.getByIndex
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y })

    return getByIndexOrig.call(tileResolver, x, y)
  }

  return function drawTileCandidates(ctx, cam) {
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

    resolvedTiles.length = 0
  }
}

const createCollisionLayer = (lvl) => {
  const drawBoundingBoxes = createEntityLayer(lvl.entities)
  const drawTileCandidates = createTileCandidateLayer(lvl.tileCollider)

  return function drawCollisionRects(ctx, cam) {
    drawTileCandidates(ctx, cam)
    drawBoundingBoxes(ctx, cam)
  }
}

export default createCollisionLayer
