`use strict`
import { loadImage } from './loaders.js'
import Spritesheet from './Spritesheet.js'

const loadMarioSprite = () => {
  return loadImage(`/assets/characters.gif`)
    .then((chars) => {
      const sprites = new Spritesheet(chars, 16, 16)
      sprites.define(`idle`, 276, 44, 16, 16)
      return sprites
  })
}

export {
  loadMarioSprite,
}
