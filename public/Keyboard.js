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

  handleEvent(ev) {
    const { keyCode, type } = ev

    if (!this.actions.has(keyCode)) return

    ev.preventDefault()

    const state = (type === `keydown`) ? PRESSED : RELEASED

    if (this.states.get(keyCode) === state) return

    this.states.set(keyCode, state)

    this.actions.get(keyCode)(state)
  }

  listenTo(window) {
    [`keydown`, `keyup`].forEach((type) => {
      window.addEventListener(type, (ev) => this.handleEvent(ev))
    })
  }
}

export default Keyboard
