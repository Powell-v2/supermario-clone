`use strict`
import Keyboard from './Keyboard.js'
import Timer from './Timer.js'

import { createMario } from './entities.js'
import { createCollisionLayer } from './layers.js'
import { loadLevel } from './loaders.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)

Promise.all([
  createMario(),
  loadLevel(`1-1`)
]).then(([ mario, lvl ]) => {
    lvl.entities.add(mario)
    const gravity = 1500

    createCollisionLayer(lvl)

    const SPACE = 32
    const keyboardInput = new Keyboard()
    keyboardInput.mapAction(SPACE, (state) => {
      if (state) mario.jump.start()
      else mario.jump.cancel()
    })
    keyboardInput.listenTo(window)

    const events = [`mousedown`, `mousemove`]

    events.forEach((type) => {
      scene.addEventListener(type, (ev) => {
        if (ev.buttons === 1) {
          mario.vel.set(0, 0)
          mario.pos.set(ev.offsetX, ev.offsetY)
        }
      })
    })

    mario.pos.set(64, 180)

    const timer = new Timer()

    timer.update = function(delta) {
      lvl.update(delta)

      lvl.comp.draw(ctx)

      mario.vel.y += gravity * delta
    }

    timer.start(0)
  })
