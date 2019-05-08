`use strict`
import Camera from './Camera.js'
import Timer from './Timer.js'

import { isMobile } from './utils/browser.js'
import loadEntities from './entities/index.js'
import { setupKeyboard } from './input.js'
import { createLevelLoader } from './loaders/level.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)
const { offsetHeight, offsetWidth } = document.getElementById(`gameHolder`)
// Extend scene and camera sizes by this value to
// hide the process of drawing new tile columns.
const drawingOffset = 32
scene.width = offsetWidth + drawingOffset
scene.height = offsetHeight

const cam = new Camera()
cam.size.set(offsetWidth + drawingOffset, offsetHeight)

window.addEventListener(`resize`, () => {
  const { offsetHeight, offsetWidth } = document.getElementById(`gameHolder`)
  cam.size.set(offsetWidth + drawingOffset, offsetHeight)
  scene.width = offsetWidth + drawingOffset
  scene.height = offsetHeight
})

async function main(ctx) {
  const entityFactory = await loadEntities()
  const lvl = await createLevelLoader(entityFactory)(`1-1`)

  const mario = entityFactory.mario()
  mario.pos.set(64, 64)
  lvl.entities.add(mario)

  if (isMobile()) {
    mario.run.direction = 1
  }

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
}

main(ctx)
