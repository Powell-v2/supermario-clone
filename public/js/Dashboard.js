`use strict`

const dashboard = document.querySelector(`.dashboard`)
const coinCounter = document.querySelector(`.coins__counter`)
const scoreCounter = document.querySelector(`.score__counter`)

export default class Dashboard {
  constructor() {
    this.coins = 0
    this.score = 0
  }

  init() {
    this._setCoinCounter()
    this._setScoreCounter()

    dashboard.classList.remove(`hidden`)
  }

  _setCoinCounter() {
    coinCounter.innerText = this.coins
  }

  _setScoreCounter() {
    scoreCounter.innerText = this.score.toString().padStart(4, 0)
  }

  incrementCoinCounter() {
    this.coins += 1
    this._setCoinCounter()
  }

  incrementScoreCounter(tileName) {
    if (tileName === `8_ball`) {
      this.score += 100
    }
    else if (tileName === `11_ball`) {
      this.score += 50
    }
    this._setScoreCounter()
  }

  reset() {
    this.coins = 0
    this.score = 0

    this._setCoinCounter()
    this._setScoreCounter()
  }
}
