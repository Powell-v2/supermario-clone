`use strict`
import Keyboard from './Keyboard.js'

const SPACE = `Space`
export const TOUCH = `Touch`
const SHIFT_LEFT = `ShiftLeft`
const RIGHT_ARROW = `ArrowRight`
const LEFT_ARROW = `ArrowLeft`
const KEY_D = `KeyD`
const KEY_A = `KeyA`

export const setupKeyboard = (hero) => {
  const keyboardInput = new Keyboard()

  keyboardInput.mapAction(SHIFT_LEFT, (state) => {
    hero.turbo(state)
  })
  keyboardInput.mapActions([SPACE, TOUCH], (state) => {
    if (state) hero.jump.start()
    else hero.jump.cancel()
  })
  keyboardInput.mapActions([RIGHT_ARROW, KEY_D], (state) => {
    hero.run.direction += state ? 1 : -1
  })
  keyboardInput.mapActions([LEFT_ARROW, KEY_A], (state) => {
    hero.run.direction += state ? -1 : 1
  })

  return keyboardInput
}
