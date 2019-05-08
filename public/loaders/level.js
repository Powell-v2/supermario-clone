`use strict`
import Level from '../Level.js'

import { createBackgroundLayer, createSpriteLayer } from '../layers.js'
import { loadJson, loadSpritesheet } from '../loaders.js'
import { Matrix } from '../math.js'

function setupCollision({ layers, patterns }, lvl) {
  const mergedTiles = layers.reduce((acc, layer) => {
    return acc.concat(layer.tiles)
  }, [])

  const collisionGrid = createCollisionGrid(mergedTiles, patterns)
  lvl.setCollisionGrid(collisionGrid)
}

function setupBackgrounds({ layers, patterns }, lvl, bgSprites) {
  layers.forEach((layer) => {
    const bgGrid = createBackgroundGrid(layer.tiles, patterns)
    lvl.comp.layers.push(createBackgroundLayer(lvl, bgGrid, bgSprites))
  })
}

function setupEntities(lvlSpec, lvl, entityFactory) {
  lvlSpec.entities.forEach(({ name, position: [x, y] }) => {
    const entity = entityFactory[name]()
    entity.pos.set(x, y)
    lvl.entities.add(entity)
  })

  lvl.comp.layers.push(createSpriteLayer(lvl.entities))
}

function createLevelLoader(entityFactory) {
  return async function loadLevel(name) {
    const lvlSpec = await loadJson(`/public/levels/${name}.json`)
    const bgSprites = await loadSpritesheet(lvlSpec.spritesheet)

    const lvl = new Level()

    setupCollision(lvlSpec, lvl)
    setupBackgrounds(lvlSpec, lvl, bgSprites)
    setupEntities(lvlSpec, lvl, entityFactory)

    return lvl
  }
}

function createCollisionGrid(tiles, patterns) {
  const matrix = new Matrix()

  for (const { x, y, tile } of expandTiles(tiles, patterns)) {
    const { type } = tile

    matrix.set(x, y, { type })
  }

  return matrix
}

function createBackgroundGrid(tiles, patterns) {
  const matrix = new Matrix()

  for (const { x, y, tile } of expandTiles(tiles, patterns)) {
    const { name } = tile

    matrix.set(x, y, { name })
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

export {
  createLevelLoader,
}
