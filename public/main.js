`use strict`
import Camera from './Camera.js'
import Timer from './Timer.js'

import loadEntities from './entities/index.js'
import { setupKeyboard } from './input.js'
import { createLevelLoader } from './loaders/level.js'

const ctx = document.getElementById(`scene`).getContext(`2d`)

async function main(ctx) {
  const entityFactory = await loadEntities()
  const lvl = await createLevelLoader(entityFactory)(`1-1`)

  const mario = entityFactory.mario()
  mario.pos.set(64, 64)
  lvl.entities.add(mario)

  const keyboardInput = setupKeyboard(mario)
  keyboardInput.listenTo(window)

  const cam = new Camera()
  const timer = new Timer()
  timer.update = function(delta) {
    lvl.update(delta)

    if (mario.pos.x > 100) {
      cam.pos.x = mario.pos.x - 100
    }

    lvl.comp.draw(ctx, cam)
  }
  timer.start(0)
}

main(ctx)
