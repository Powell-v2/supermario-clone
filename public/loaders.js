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

const createTiles = (lvl, bgs) => {
  function applyRange(bg, xStart, xLen, yStart, yLen ) {
    const xEnd = xStart + xLen
    const yEnd = yStart + yLen

    for (let x = xStart; x < xEnd; x += 1) {
      for (let y = yStart; y < yEnd; y += 1) {
        lvl.tiles.set(x, y, {
          name: bg.tile,
          type: bg.type,
        })
      }
    }
  }

  bgs.forEach((bg) => {
    bg.ranges.forEach((range) => {
      if (range.length === 4) {
        applyRange(bg, ...range)
      }
      else if (range.length === 3) {
        const [xStart, xLen, yStart] = range
        applyRange(bg, xStart, xLen, yStart, 1)
      }
      else if (range.length === 2) {
        const [xStart, yStart] = range
        applyRange(bg, xStart, 1, yStart, 1)
      }
    })
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
  const lvlSpec = await loadJson(`/public/levels/${name}.json`)
  const bgSprites = await loadSpritesheet(lvlSpec.spritesheet)
  const cam = new Camera()

  const lvl = new Level()

  createTiles(lvl, lvlSpec.backgrounds)

  lvl.comp.layers.push(
    createBackgroundLayer(lvl, bgSprites),
    createSpriteLayer(lvl.entities),
  )

  return {
    lvl,
    cam,
  }
}

export {
  loadImage,
  loadLevel,
  loadSpritesheet,
}
