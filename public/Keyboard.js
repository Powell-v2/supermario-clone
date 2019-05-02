`use strict`

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
    const { code, type } = ev

    if (!this.actions.has(code)) return

    ev.preventDefault()

    const state = (type === `keydown`) ? PRESSED : RELEASED

    if (this.states.get(code) === state) return

    this.states.set(code, state)

    this.actions.get(code)(state)
  }

  listenTo(window) {
    [`keydown`, `keyup`].forEach((type) => {
      window.addEventListener(type, (ev) => this.handleEvent(ev))
    })
  }
}

export default Keyboard
