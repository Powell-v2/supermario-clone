`use strict`
import Level from './Level.js'

import {
  createBackgroundLayer,
  createSpriteLayer,
  createCollisionLayer,
} from './layers.js'
import { loadBackgroundSprites } from './sprites.js'

const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.addEventListener(`load`, () => resolve(img))
    img.src = url
  })
}

const createTiles = (lvl, bgs) => {
  bgs.forEach((bg) => {
    bg.ranges.forEach(({ x: [x1, x2], y: [y1, y2] }) => {
      for (let x = x1; x < x2; x += 1) {
        for (let y = y1; y < y2; y += 1) {
          lvl.tiles.set(x, y, { name: bg.tile })
        }
      }
    })
  })
}

const loadLevel = (name) => {
  return Promise.all([
    loadBackgroundSprites(),
    fetch(`/levels/${name}.json`).then((r) => r.json())
  ]).then(([ bgSprites, lvlSpec ]) => {
    const lvl = new Level()

    createTiles(lvl, lvlSpec.backgrounds)

    lvl.comp.layers.push(
      createBackgroundLayer(lvl, bgSprites),
      createSpriteLayer(lvl.entities),
      createCollisionLayer(lvl),
    )

    return lvl
  })
}

export {
  loadImage,
  loadLevel,
}
