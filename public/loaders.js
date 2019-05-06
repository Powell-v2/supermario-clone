`use strict`
import Camera from './Camera.js'
import Level from './Level.js'
import Spritesheet from './Spritesheet.js'

import { createAnimation } from './animation.js'

import {
  createBackgroundLayer,
  createSpriteLayer,
} from './layers.js'

function loadJson(url) {
  return fetch(url).then((r) => r.json())
}

const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.addEventListener(`load`, () => resolve(img))
    img.src = url
  })
}

async function loadSpritesheet(name) {
  const {
    imageURL,
    tiles,
    frames,
    animations,
    tileW,
    tileH,
  } = await loadJson(`/public/sprites/${name}.json`)
  const img = await loadImage(imageURL)

  const sprites = new Spritesheet(img, tileW, tileH)

  if (tiles) {
    tiles.forEach(({ name, index: [x,y] }) => sprites.defineTile(name, x, y))
  }

  if (frames) {
    frames.forEach(({ name, rect }) => sprites.define(name, ...rect))
  }

  if (animations) {
    animations.forEach(({ name, frames, frameLen }) => {
      const animation = createAnimation(frames, frameLen)
      sprites.defineAnimation(name, animation)
    })
  }

  return sprites
}

async function loadLevel(name) {
  const {
    spritesheet,
    backgrounds,
    patterns
  } = await loadJson(`/public/levels/${name}.json`)
  const bgSprites = await loadSpritesheet(spritesheet)
  const cam = new Camera()

  const lvl = new Level()

  createTiles(lvl, backgrounds, patterns)

  lvl.comp.layers.push(
    createBackgroundLayer(lvl, bgSprites),
    createSpriteLayer(lvl.entities),
  )

  return {
    lvl,
    cam,
  }
}

const createTiles = (lvl, bgs, patterns, offsetX = 0, offsetY = 0) => {
  function applyRange(bg, xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen
    const yEnd = yStart + yLen

    for (let x = xStart; x < xEnd; x += 1) {
      for (let y = yStart; y < yEnd; y += 1) {
        const derivedX = x + offsetX
        const derivedY = y + offsetY

        if (bg.pattern) {
          const patternBgs = patterns[bg.pattern].backgrounds
          createTiles(lvl, patternBgs, patterns, derivedX, derivedY)
        }
        else {
          lvl.tiles.set(derivedX, derivedY, {
            name: bg.tile,
            type: bg.type,
          })
        }
      }
    }
  }

  bgs.forEach((bg) => {
    bg.ranges.forEach((range) => {
      // Draw several tiles of arbitrary width & height at position {x,y}.
      if (range.length === 4) {
        applyRange(bg, ...range)
      }
      // Draw several tiles horizontally at position {x,y}.
      else if (range.length === 3) {
        const [xStart, xLen, yStart] = range
        applyRange(bg, xStart, xLen, yStart, 1)
      }
      // Draw 1 tile at position {x,y}.
      else if (range.length === 2) {
        const [xStart, yStart] = range
        applyRange(bg, xStart, 1, yStart, 1)
      }
    })
  })
}

export {
  loadImage,
  loadLevel,
  loadSpritesheet,
}
