`use strict`
import Timer from './Timer.js'

import loadEntities from './entities/index.js'
import { setupKeyboard } from './input.js'
import { loadLevel } from './loaders/level.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)

Promise.all([
  loadEntities(),
  loadLevel(`1-1`)
]).then(([
  entity,
  { lvl, cam }
]) => {
  const mario = entity.mario()
  mario.pos.set(64, 64)
  lvl.entities.add(mario)

  const goomba = entity.goomba()
  goomba.pos.set(150, 16)
  lvl.entities.add(goomba)

  const koopa = entity.koopa()
  koopa.pos.set(333, 5)
  lvl.entities.add(koopa)

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
