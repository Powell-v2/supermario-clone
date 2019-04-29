`use strict`
import { loadImage } from './loaders.js'
import Spritesheet from './Spritesheet.js'

const loadBackgroundSprites = () => {
  return loadImage(`/assets/backgrounds.png`)
    .then((bgs) => {
      const sprites = new Spritesheet(bgs, 16, 16)
      sprites.defineTile(`ground`, 0, 0)
      sprites.defineTile(`sky`, 3, 23)
      return sprites
  })
}

const loadMarioSprite = () => {
  return loadImage(`/assets/characters.gif`)
    .then((chars) => {
      const sprites = new Spritesheet(chars, 16, 16)
      sprites.define(`idle`, 276, 44, 16, 16)
      return sprites
  })
}

export {
  loadBackgroundSprites,
  loadMarioSprite,
}
