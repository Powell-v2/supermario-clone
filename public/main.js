`use strict`
import Spritesheet from './Spritesheet.js'
import { loadImage, loadLevel } from './loaders.js'

const drawBackground = (bg, ctx, sprites) => {
  bg.ranges.forEach(({ x: [x1, x2], y: [y1, y2] }) => {
    for (let x = x1; x < x2; x += 1) {
      for (let y = y1; y < y2; y += 1) {
        sprites.drawTile(bg.tile, ctx, x, y)
      }
    }
  })
}

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)

const loadBackgroundSprites = () => {
  return loadImage(`/assets/tileset.png`)
    .then((img) => {
      const sprites = new Spritesheet(img, 16, 16)
      sprites.define(`ground`, 0, 0)
      sprites.define(`sky`, 3, 23)
      return sprites
  })
}

Promise.all([loadBackgroundSprites(), loadLevel(`1-1`)])
  .then(([ sprites, lvl ]) => {
    lvl.backgrounds.forEach((bg) => drawBackground(bg, ctx, sprites))
  })
