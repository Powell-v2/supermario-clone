`use strict`
import { TOUCH } from './input.js'
import { isMobile } from './utils/browser.js'

const PRESSED = 1
const RELEASED = 0

class Keyboard {
  constructor() {
    this.states = new Map()
    this.actions = new Map()
  }

  mapAction(code, cb) {
    this.actions.set(code, cb)
  }

  mapActions(codes, cb) {
    codes.forEach((code) => this.actions.set(code, cb))
  }

  handleEvent(ev) {
    let { code, type } = ev
    // Code for touch events is undefined.
    const isTouch = !code
    if (isTouch) code = TOUCH
    if (!this.actions.has(code)) return
    // Prevent default behaviour only for keyboard events.
    if (!isTouch) ev.preventDefault()

    const state = (type === `keydown` || type === `touchstart` || type === `mousedown`)
      ? PRESSED : RELEASED

    if (this.states.get(code) === state) return

    this.states.set(code, state)
    this.actions.get(code)(state)
  }

  listenTo(target) {
    if (isMobile() && ('ontouchstart' in window)) {
      const mobileEvents = [`touchstart`, `touchend`]
      mobileEvents.forEach((type) => {
        target.addEventListener(type, (ev) => this.handleEvent(ev))
      })
    }
    else if (isMobile() && !('ontouchstart' in window)) {
      const safariMobileEvents = [`mousedown`, `mouseup`]
      safariMobileEvents.forEach((type) => {
        target.addEventListener(type, (ev) => this.handleEvent(ev))
      })
    }
    else {
      const keyboardEvents = [`keydown`, `keyup`]
      keyboardEvents.forEach((type) => {
        target.addEventListener(type, (ev) => this.handleEvent(ev))
      })
    }
  }
}

export default Keyboard
