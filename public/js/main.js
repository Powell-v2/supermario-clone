`use strict`
import AudioControls from './AudioControls.js'
import Camera from './Camera.js'
import Timer from './Timer.js'
import Entity from './Entity.js'
import PlayerController from './traits/PlayerController.js'

import loadEntities from './entities/index.js'
import { createLevelLoader } from './loaders/level.js'
import { loadJson } from './loaders/helpers.js'
import { isMobile } from './utils/browser.js'

const scene = document.getElementById(`scene`)
const container = document.getElementById(`gameHolder`)
const { devicePixelRatio } = window
const ctx = scene.getContext(`2d`)
const drawingOffset = 35
const camera = new Camera()

function setSize() {
  const { offsetHeight, offsetWidth } = container

  camera.size.set(offsetWidth + drawingOffset, offsetHeight)
  // Offset scene and cam by this value to hide undrawn column`
  scene.style.width = `${offsetWidth}px`
  scene.style.height = `${offsetHeight}px`
  scene.width = (offsetWidth - drawingOffset) * devicePixelRatio
  scene.height = offsetHeight * devicePixelRatio

  ctx.scale(devicePixelRatio, devicePixelRatio)
}

setSize()
window.addEventListener(`resize`, setSize)

export function createPlayerEnvironment(playerEnt) {
  const playerEnv = new Entity()
  const playerCtrl = new PlayerController()

  playerCtrl.checkpoint.set(10, 100)
  playerCtrl.setPlayer(playerEnt)
  playerEnv.addTrait(playerCtrl)

  return playerEnv
}

export function setupPlayerSelectors(handler) {
  const playerSelectors = document.querySelectorAll(`.playerButton`)
  const eventType = (isMobile() && ('ontouchstart' in window)) ? `touchstart` : `click`

  const handleSelect = (ev) => {
    handler(ev)

    playerSelectors.forEach((button) => {
      button.removeEventListener(eventType, handleSelect)
    })
  }

  playerSelectors.forEach((button) => {
    button.addEventListener(eventType, handleSelect)
  })
}

async function main(ctx) {
  const audioControls = new AudioControls(await loadJson(`/public/assets/audio/config.json`))
  const entityFactory = await loadEntities()
  const lvl = await createLevelLoader(entityFactory, `1-1`)

  lvl.audioControls = audioControls
  lvl.camera = camera
  lvl.ctx = ctx
  lvl.timer = new Timer()

  lvl.timer.update = function(delta) {
    lvl.update(delta)

    lvl.comp.draw(ctx, camera)
  }
  lvl.timer.start(0)

  audioControls.prepareSoundsForInitialization()
  setupPlayerSelectors(lvl.init.bind(lvl))
}

main(ctx)
