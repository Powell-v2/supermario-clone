`use strict`

export function randomColor() {
  let hexBalues = `ABCDEF0123456789`
  let nums = []
  let brightest = 0
  let color = `#`

  for (let i = 0; i < 3; i += 1) {
    nums[i] = Math.floor(Math.random() * 256)
  }

  for (let i = 0; i < 3; i += 1) {
    if (brightest < nums[i]) {
      brightest = nums[i]
    }
  }

  brightest /= 255

  for (let i = 0; i < 3; i += 1) {
    nums[i] /= brightest
  }

  for (let i = 0; i < 3; i += 1) {
    color += hexBalues[Math.floor(nums[i] / 16)]
    color += hexBalues[Math.floor(nums[i] % 16)]
  }

  return color
}

export function randomVector(max) {
  let direction = Math.random() * Math.PI * 2
  let spd = Math.random() * max

  return {
    x: Math.cos(direction) * spd,
    y: Math.sin(direction) * spd,
  }
}
