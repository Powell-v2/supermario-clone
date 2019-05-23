`use strict`
import Firework from './Firework.js'
import AudioControls from '../../AudioControls.js'

const container = document.getElementById(`gameHolder`)
export const id = `fireworks`

let canvas
let ctx
let intervalId
let audioControls

let fireworks = []
let particles = []

let fillColor = `black`

export function destroy() {
  window.removeEventListener(`resize`, handleResize)

  clearTimeout(intervalId)

  fireworks = []
  particles = []

  container.removeChild(canvas)
}

export function launch() {
  const { offsetWidth, offsetHeight } = container

  audioControls = new AudioControls()

  canvas = document.createElement(`canvas`)
  canvas.setAttribute(`id`, id)
  container.appendChild(canvas)

  ctx = canvas.getContext(`2d`)

  setSize()

  ctx.fillStyle = fillColor
  ctx.fillRect(0, 0, offsetWidth, offsetHeight)

  fireworks.push(new Firework(Math.random() * offsetWidth, container.offsetHeight))

  window.addEventListener(`resize`, handleResize)

  intervalId = setInterval(loop, 1000/60)

  return canvas
}

function setSize() {
  const { offsetWidth, offsetHeight } = container
  const { devicePixelRatio } = window

  canvas.style.width = `${offsetWidth}px`
  canvas.style.height = `${offsetHeight}px`

  canvas.width = offsetWidth * devicePixelRatio
  canvas.height = offsetHeight * devicePixelRatio

  canvas.getContext(`2d`).scale(devicePixelRatio, devicePixelRatio)
}

function handleResize() {
  const { offsetWidth, offsetHeight } = container

  setSize()

  ctx.fillStyle = fillColor
  ctx.fillRect(0, 0, offsetWidth, offsetHeight)
}

function loop() {
  const { offsetWidth, offsetHeight } = container
  ctx.globalAlpha = 0.1
  ctx.fillStyle = fillColor
  ctx.fillRect(0, 0, offsetWidth, offsetHeight)
  ctx.globalAlpha = 1

  const fireworksLength = fireworks.length
  for (let i = 0; i < fireworksLength; i += 1) {
    if (!fireworks[i]) return

    fireworks[i].update(particles)
    fireworks[i].draw(ctx)

    if (fireworks[i].isBlown) {
      audioControls.play(`fireworks`)
      fireworks.splice(i, 1)
    }
  }

  const particlesLength = particles.length
  for (let i = 0; i < particlesLength; i += 1) {
    if (!particles[i]) return

    particles[i].update()
    particles[i].draw(ctx)

    if (particles[i].lifetime > 100) {
      particles.splice(i, 1)
    }
  }

  if (Math.random() < 0.05) {
    fireworks.push(new Firework(Math.random() * offsetWidth, container.offsetHeight))
  }
}
