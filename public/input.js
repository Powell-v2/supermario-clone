`use strict`
import Keyboard from './Keyboard.js'

const SPACE = `Space`
export const TOUCH = `Touch`
const SHIFT_LEFT = `ShiftLeft`
const RIGHT_ARROW = `ArrowRight`
const LEFT_ARROW = `ArrowLeft`
const KEY_D = `KeyD`
const KEY_A = `KeyA`

export const setupKeyboard = (mario) => {
  const keyboardInput = new Keyboard()

  keyboardInput.mapAction(SHIFT_LEFT, (state) => {
    mario.turbo(state)
  })
  keyboardInput.mapActions([SPACE, TOUCH], (state) => {
    if (state) mario.jump.start()
    else mario.jump.cancel()
  })
  keyboardInput.mapActions([RIGHT_ARROW, KEY_D], (state) => {
    mario.run.direction += state ? 1 : -1
  })
  keyboardInput.mapActions([LEFT_ARROW, KEY_A], (state) => {
    mario.run.direction += state ? -1 : 1
  })

  return keyboardInput
}
