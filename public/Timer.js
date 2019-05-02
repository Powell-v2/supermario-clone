`use strict`

class Timer {
  constructor(delta = 1/60) {
    let accumulatedTime = 0
    let lastTimestamp = 0

    this.updateProxy = (timestamp) => {
      accumulatedTime += (timestamp - lastTimestamp) / 1000

      if (accumulatedTime > 1) {
        accumulatedTime = 1
      }

      while (accumulatedTime > delta) {
        this.update(delta)

        accumulatedTime -= delta
      }

      lastTimestamp = timestamp

      this.enqueue()
    }
  }

  enqueue() {
    requestAnimationFrame(this.updateProxy)
  }

  start() {
    this.enqueue()
  }
}

export default Timer
