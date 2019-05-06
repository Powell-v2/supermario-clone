`use strict`
import Camera from '../Camera.js'
import Level from '../Level.js'

import { createBackgroundLayer, createSpriteLayer } from '../layers.js'
import { loadJson, loadSpritesheet } from '../loaders.js'
import { Matrix } from '../math.js'

async function loadLevel(name) {
  const {
    spritesheet,
    layers,
    patterns
  } = await loadJson(`/public/levels/${name}.json`)
  const bgSprites = await loadSpritesheet(spritesheet)

  const cam = new Camera()
  const lvl = new Level()

  const mergedTiles = layers.reduce((acc, layer) => {
    return acc.concat(layer.tiles)
  }, [])

  const collisionGrid = createCollisionGrid(mergedTiles, patterns)
  lvl.setCollisionGrid(collisionGrid)

  layers.forEach((layer) => {
    const bgGrid = createBackgroundGrid(layer.tiles, patterns)
    lvl.comp.layers.push(createBackgroundLayer(lvl, bgGrid, bgSprites))
  })

  lvl.comp.layers.push(createSpriteLayer(lvl.entities))

  return {
    lvl,
    cam,
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
    for (const elem of expandRange(range)) {
      yield elem
    }
  }
}

const expandTiles = (tiles, patterns) => {
  let expandedTiles = []

  function walkTiles(tiles, offsetX, offsetY) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX
        const derivedY = y + offsetY

        if (tile.pattern) {
          const patternTiles = patterns[tile.pattern].tiles
          walkTiles(patternTiles, derivedX, derivedY)
        }
        else {
          expandedTiles.push({
            tile,
            x: derivedX,
            y: derivedY,
          })
        }
      }
    }
  }

  walkTiles(tiles, 0, 0)

  return expandedTiles
}

export {
  loadLevel,
}
