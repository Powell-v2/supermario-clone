`use strict`

function createAnimation(frames, frameLen) {
  return function resolveFrame(distance) {
    const idx = Math.floor(distance / frameLen % frames.length)
    return frames[idx]
  }
}

export {
  createAnimation,
}
