`use strict`
import Timer from './Timer.js'

import { loadMario } from './entities/mario.js'
import { loadLevel } from './loaders/level.js'
import { setupKeyboard } from './input.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)

Promise.all([
  loadMario(),
  loadLevel(`1-1`)
]).then(([ createMario, { lvl, cam } ]) => {
  const mario = createMario()
  lvl.entities.add(mario)
  mario.pos.set(64, 64)

  mario.addTrait({
    NAME: `hack_trait`,
    spawnTimeout: 0,
    obstruct() {},
    update(mario, delta) {
      if (mario.vel.y < 0 && this.spawnTimeout > 0.1) {
        const clone = createMario()
        clone.pos.x = mario.pos.x
        clone.pos.y = mario.pos.y
        clone.vel.x = mario.vel.x - 200
        clone.vel.y = mario.vel.y - 200
        lvl.entities.add(clone)

        this.spawnTimeout = 0
      }

      this.spawnTimeout += delta
    }
  })

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
