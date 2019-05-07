`use strict`
import Timer from './Timer.js'

import { loadMario } from './entities/mario.js'
import { loadGoomba } from './entities/goomba.js'
import { loadLevel } from './loaders/level.js'
import { setupKeyboard } from './input.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)

Promise.all([
  loadMario(),
  loadGoomba(),
  loadLevel(`1-1`)
]).then(([
  createMario,
  createGoomba,
  { lvl, cam }
]) => {
  const mario = createMario()
  mario.pos.set(64, 64)
  lvl.entities.add(mario)

  const goomba = createGoomba()
  goomba.pos.set(150, 16)
  lvl.entities.add(goomba)

  const keyboardInput = setupKeyboard(mario)
  keyboardInput.listenTo(window)

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
