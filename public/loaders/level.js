`use strict`
import Level from '../Level.js'

import { loadJson, loadSpritesheet } from '../loaders.js'
import { Matrix } from '../math.js'

export async function createLevelLoader(entityFactory, name) {
  const lvlSpec = await loadJson(`/public/levels/${name}.json`)
  const bgSprites = await loadSpritesheet(lvlSpec.spritesheet)

  const lvl = new Level(lvlSpec, bgSprites, entityFactory)

  lvl.reset()

  return lvl
}

export function createGrid(tiles, patterns) {
  const matrix = new Matrix()

  for (const { x, y, tile } of expandTiles(tiles, patterns)) {
    const { ranges, ...attrs } = tile
    matrix.set(x, y, { ...attrs })
  }

  return matrix
}

function* expandSpan(xStart, xLen, yStart, yLen) {
  const xEnd = xStart + xLen
  const yEnd = yStart + yLen

  for (let x = xStart; x < xEnd; x += 1) {
    for (let y = yStart; y < yEnd; y += 1) {
      yield { x, y }
    }
  }
}

function expandRange(range) {
  if (range.length === 4) {
    return expandSpan(...range)
  }
  else if (range.length === 3) {
    const [xStart, xLen, yStart] = range
    return expandSpan(xStart, xLen, yStart, 1)
  }
  else if (range.length === 2) {
    const [xStart, yStart] = range
    return expandSpan(xStart, 1, yStart, 1)
  }
}

function* expandRanges(ranges) {
  for (const range of ranges) {
    yield* expandRange(range)
  }
}

function* expandTiles(tiles, patterns) {
  function* walkTiles(tiles, offsetX, offsetY) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX
        const derivedY = y + offsetY

        if (tile.pattern) {
          const patternTiles = patterns[tile.pattern].tiles
          yield* walkTiles(patternTiles, derivedX, derivedY)
        }
        else {
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          }
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0)
}
