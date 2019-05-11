`use strict`
import Camera from './Camera.js'
import Timer from './Timer.js'
import Entity from './Entity.js'
import PlayerController from './traits/PlayerController.js'

import { isMobile } from './utils/browser.js'
import loadEntities from './entities/index.js'
import { setupKeyboard } from './input.js'
import { createLevelLoader } from './loaders/level.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)
const { offsetHeight, offsetWidth } = document.getElementById(`gameHolder`)
// Extend scene and camera sizes by this value to
// hide the process of drawing new tile columns.
const drawingOffset = 70
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

function createPlayerEnvironment(playerEnt) {
  const playerEnv = new Entity()
  const playerCtrl = new PlayerController()

  playerCtrl.checkpoint.set(105, 105)
  playerCtrl.setPlayer(playerEnt)
  playerEnv.addTrait(playerCtrl)

  return playerEnv
}

async function main(ctx) {
  const entityFactory = await loadEntities()
  const lvl = await createLevelLoader(entityFactory)(`1-1`)

  const timer = new Timer()
  timer.update = function(delta) {
    lvl.update(delta)

    lvl.comp.draw(ctx, cam)
  }
  timer.start(0)

  setupHandlers(lvl, entityFactory, timer)
}

function setupHandlers(lvl, entityFactory, timer) {
  const playerSelectors = document.querySelectorAll(`.playerButton`)
  const overlay = document.getElementById(`gameOverlay`)
  // Use 'click' in Safari as it doesn't support touch events
  const eventType = (isMobile() && ('ontouchstart' in window)) ? `touchstart` : `click`

  const handleSelect = (ev) => {
    overlay.style.visibility = `hidden`

    const { name } = ev.target.dataset
    const hero = entityFactory[name]()
    const playerEnv = createPlayerEnvironment(hero)
    const keyboardInput = setupKeyboard(hero)

    lvl.entities.add(playerEnv)

    if (isMobile()) {
      hero.run.direction = 1
      keyboardInput.listenTo(scene)
    }
    else {
      keyboardInput.listenTo(window)
    }

    timer.update = function(delta) {
      lvl.update(delta)

      // Limit camerate movement to 2260px - which is the rightmost edge of the level.
      // Behind the edge there is a wall of tiles which blocks the character.
      cam.pos.x = Math.max(0, Math.min(hero.pos.x - 105, 2260))

      lvl.comp.draw(ctx, cam)
    }

    playerSelectors.forEach((button) => {
      button.removeEventListener(eventType, handleSelect)
    })
  }

  playerSelectors.forEach((button) => {
    button.addEventListener(eventType, handleSelect)
  })
}

main(ctx)
