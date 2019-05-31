`use strict`
import TileResolver from '../TileResolver.js'

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
            if (tile.destroyable && tile.touchedAt) {
              const delta = lvl.totalTime - tile.touchedAt

              if (delta < 2) {
                sprites.drawShards(tile.name, ctx, 2, x - startIdx, y, delta * 5)
              }
              else {
                tiles.removeOne(x, y)
              }
            }
            else if (tile.withCoin && tile.touchedAt) {
              const delta = lvl.totalTime - tile.touchedAt

              if (delta < 2) {
                sprites.extractCoin(tile.name, ctx, x - startIdx, y, delta)
              }
              else {
                sprites.drawTile(tile.name, ctx, x - startIdx, y)
                tiles.set(x, y, {
                  ...tile,
                  withCoin: false,
                })
              }
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

export default createBackgroundLayer
