`use strict`
import Spritesheet from '../Spritesheet.js'

import { createAnimation } from '../utils/animation.js'

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

export {
  loadImage,
  loadSpritesheet,
  loadJson,
}
