`use strict`
import Keyboard from './Keyboard.js'

const SPACE = `Space`
const RIGHT_ARROW = `ArrowRight`
const LEFT_ARROW = `ArrowLeft`

const setupKeyboard = (entity) => {
  const keyboardInput = new Keyboard()

  keyboardInput.mapAction(SPACE, (state) => {
    if (state) entity.jump.start()
    else entity.jump.cancel()
  })
  keyboardInput.mapAction(RIGHT_ARROW, (state) => {
    entity.run.direction += state ? 1 : -1
  })
  keyboardInput.mapAction(LEFT_ARROW, (state) => {
    entity.run.direction += state ? -1 : 1
  })

  return keyboardInput
}

export {
  setupKeyboard,
}
