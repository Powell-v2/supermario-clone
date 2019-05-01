`use strict`
import Timer from './Timer.js'

import { createMario } from './entities.js'
import { loadLevel } from './loaders.js'
import { setupKeyboard } from './input.js'
import { setupMouseControl } from './debug.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)

Promise.all([
  createMario(),
  loadLevel(`1-1`)
]).then(([ mario, { lvl, cam } ]) => {
  // NOTE: for debugging
  setupMouseControl(scene, mario, cam)

  lvl.entities.add(mario)

  const keyboardInput = setupKeyboard(mario)
  keyboardInput.listenTo(window)

  mario.pos.set(64, 180)

  const timer = new Timer()

  timer.update = function(delta) {
    lvl.update(delta)

    lvl.comp.draw(ctx, cam)
  }

  timer.start(0)
})
