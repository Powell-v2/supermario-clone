`use strict`
import Particle from './Particle.js'

import { randomColor } from '../helpers.js'

export default class Firework {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.isBlown = false
    this.color = randomColor()
    this.speed = 5
  }

  update(particles) {
    this.y -= this.speed

    if (this.y < 300 - Math.sqrt(Math.random() * 400) * 40) {
      this.isBlown = true

      for (let i = 0; i < 100; i += 1) {
        particles.push(new Particle(this.x, this.y, this.color))
      }
    }
  }

  draw(ctx) {
    ctx.globalAlpha = 1
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, 2, 2)
  }
}
