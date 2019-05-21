`use strict`
import { randomVector } from '../utils.js'

export default class Particle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.vel = randomVector(2)
    this.lifetime = 0
  }

  update() {
    this.x += this.vel.x
    this.y += this.vel.y
    this.vel.x *= 0.99
    this.vel.y *= 0.99
    this.lifetime += 1
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(1 - this.lifetime / 100, 0)
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, 2, 2)
  }
}
