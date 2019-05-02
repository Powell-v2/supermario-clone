`use strict`
import Timer from './Timer.js'

import { createMario } from './entities.js'
import { loadLevel } from './loaders.js'
import { setupKeyboard } from './input.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)

Promise.all([
  createMario(),
  loadLevel(`1-1`)
]).then(([ mario, { lvl, cam } ]) => {
  lvl.entities.add(mario)

  const keyboardInput = setupKeyboard(mario)
  keyboardInput.listenTo(window)

  mario.pos.set(64, 180)

  const timer = new Timer()

  timer.update = function(delta) {
    lvl.update(delta)

    if (mario.pos.x > 100) {
      cam.pos.x = mario.pos.x - 100
    }

    lvl.comp.draw(ctx, cam)
  }

  timer.start(0)
})
