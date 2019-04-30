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
    entity.walk.direction = state
  })
  keyboardInput.mapAction(LEFT_ARROW, (state) => {
    entity.walk.direction = -state
  })

  return keyboardInput
}

export {
  setupKeyboard,
}
