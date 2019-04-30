`use strict`
import Compositor from './Compositor.js'
import Entity from './Entity.js'
import Timer from './Timer.js'

import { createMario } from './entities.js'
import { createBackgroundLayer, createSpriteLayer } from './layers.js'
import { loadLevel } from './loaders.js'
import { loadBackgroundSprites } from './sprites.js'

const scene = document.getElementById(`scene`)
const ctx = scene.getContext(`2d`)

Promise.all([
  createMario(),
  loadBackgroundSprites(),
  loadLevel(`1-1`)
])
  .then(([ mario, bgSprites, lvl ]) => {
    const comp = new Compositor()
    const bgLayer = createBackgroundLayer(lvl.backgrounds, bgSprites)
    comp.layers.push(bgLayer)

    const gravity = 1500

    mario.pos.set(64, 180)
    mario.vel.set(150, -500)

    const spriteLayer = createSpriteLayer(mario)
    comp.layers.push(spriteLayer)

    const timer = new Timer()

    timer.update = function(delta) {
      mario.update(delta)
      
      comp.draw(ctx)

      mario.vel.y += gravity * delta
    }

    timer.start(0)
  })
