`use strict`
import Camera from './Camera.js'
import Level from './Level.js'
import Spritesheet from './Spritesheet.js'

import {
  createBackgroundLayer,
  createSpriteLayer,
  createCollisionLayer,
  createCameraLayer,
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

async function loadSpritesheet (name) {
  const { imageURL, tiles, tileW, tileH } = await loadJson(`/sprites/${name}.json`)
  const img = await loadImage(imageURL)

  const sprites = new Spritesheet(img, tileW, tileH)

  tiles.forEach(({ name, index: [x,y] }) => sprites.defineTile(name, x, y))

  return sprites
}

async function loadLevel(name) {
  const lvlSpec = await loadJson(`/levels/${name}.json`)
  const bgSprites = await loadSpritesheet(lvlSpec.spritesheet)
  const cam = new Camera()

  const lvl = new Level()

  createTiles(lvl, lvlSpec.backgrounds)

  lvl.comp.layers.push(
    createBackgroundLayer(lvl, bgSprites),
    createSpriteLayer(lvl.entities),
    createCollisionLayer(lvl),
    createCameraLayer(cam),
  )

  return {
    lvl,
    cam,
  }
}

export {
  loadImage,
  loadLevel,
}
