`use strict`
import TileResolver from './TileResolver.js'

const createBackgroundLayer = (lvl, tiles, sprites) => {
  const tileResolver = new TileResolver(tiles)
  const buff = document.createElement(`canvas`)
  const ctx = buff.getContext(`2d`)
  const { offsetHeight } = document.getElementById(`gameHolder`)
  buff.width = window.screen.availWidth
  buff.height = offsetHeight

  function redraw(startIdx, endIdx) {
    ctx.clearRect(0, 0, buff.width, buff.height)

    for (let x = startIdx; x < endIdx; x += 1) {
      const col = tiles.grid[x]

      if (col) {
        col.forEach((tile, y) => {
          if (sprites.animations.has(tile.name)) {
            sprites.drawAnimation(tile.name, ctx, x - startIdx, y, lvl.totalTime)
          }
          else {
            if (tile.destroyable && tile.remove) {
              const delta = lvl.totalTime - tile.touchedAt / 1000
              delta < 2
                ? sprites.shredTile(tile.name, ctx, x - startIdx, y, delta * 5)
                : tiles.removeOne(x, y)
            }
            else {
              sprites.drawTile(tile.name, ctx, x - startIdx, y)
            }
          }
        })
      }
    }
  }

  return function drawBackgroundLayer(ctx, cam) {
    const drawW = tileResolver.toIndex(cam.size.x)
    const drawFrom = tileResolver.toIndex(cam.pos.x)
    const drawTo = drawFrom + drawW

    redraw(drawFrom, drawTo)

    ctx.drawImage(
      buff,
      -cam.pos.x % 35,
      -cam.pos.y
    )
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
        ent.pos.x - cam.pos.x,
        ent.pos.y - cam.pos.y
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

function createCameraLayer(camToDraw) {
  return function drawCameraRect(ctx, fromCam) {
    ctx.strokeStyle = `lime`
    ctx.beginPath()
    ctx.rect(
      camToDraw.pos.x - fromCam.pos.x,
      camToDraw.pos.y - fromCam.pos.y,
      camToDraw.size.x,
      camToDraw.size.y
    )
    ctx.stroke()
  }
}

export {
  createBackgroundLayer,
  createSpriteLayer,
  createCollisionLayer,
  createCameraLayer,
}
