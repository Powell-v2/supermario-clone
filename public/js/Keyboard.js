`use strict`
import { TOUCH } from './input.js'
import { isMobile } from './utils/browser.js'

const PRESSED = 1
const RELEASED = 0

export default class Keyboard {
  constructor() {
    this.states = new Map()
    this.actions = new Map()

    this.target = null
    this.registeredHandler = null

    this.events = []
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

  determineEventTypes() {
    if (isMobile() && ('ontouchstart' in window)) {
      this.events = [`touchstart`, `touchend`]
    }
    // Edge case: Safari doesn't recognize ontouch* event types
    else if (isMobile() && !('ontouchstart' in window)) {
      this.events = [`mousedown`, `mouseup`]
    }
    else {
      this.events = [`keydown`, `keyup`]
    }
  }

  listenTo(target) {
    this.target = target
    this.registeredHandler = (ev) => this.handleEvent(ev)

    this.determineEventTypes()
    this.events.forEach((type) => {
      target.addEventListener(type, this.registeredHandler)
    })
  }

  removeListeners() {
    this.determineEventTypes()
    this.events.forEach((type) => {
      this.target.removeEventListener(type, this.registeredHandler)
    })
  }
}
