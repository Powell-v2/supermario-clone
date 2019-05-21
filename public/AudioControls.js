`use strict`
const muteOffIcon = document.querySelector(`.mute--off`)
const muteOnIcon = document.querySelector(`.mute--on`)

export default class AudioControls {
  constructor(config) {
    // Instantiate only once.
    const instance = this.constructor.instance
    if (instance) return instance
    this.constructor.instance = this;

    this.isMuted = false

    this.audioCtx = new (
      window.AudioContext_BACKUP ||
      window.AudioContext ||
      window.webkitAudioContext
    )

    this.audioElems = {}
    config.map(({ name, format, loop }) => {
      const audioEl = new window.Audio(`/public/assets/audio/${name}.${format}`)

      if (loop) audioEl.loop = true
      if (format === `mp3`) audioEl.setAttribute(`type`, `audio/mpeg`)

      this.audioCtx
        .createMediaElementSource(audioEl)
        .connect(this.audioCtx.destination)

      this.audioElems[name] = audioEl
    })
  }

  play(name) {
    if (this.isMuted) return

    this.audioElems[name].play()
  }

  switchIcons() {
    muteOnIcon.classList.toggle(`hidden`)
    muteOffIcon.classList.toggle(`hidden`)
  }

  mute() {
    this.isMuted = true

    this.switchIcons()

    for (const el of Object.values(this.audioElems)) {
      if (el.loop) el.pause()
    }
  }

  unmute() {
    this.isMuted = false

    this.switchIcons()

    for (const el of Object.values(this.audioElems)) {
      if (el.loop) el.play()
    }
  }

  setupMuteButton(btn, evType) {
    // Initially both icons are hidden - show mute_off button on game start
    if (
      muteOffIcon.classList.contains(`hidden`) &&
      muteOnIcon.classList.contains(`hidden`)
    ) {
      muteOffIcon.classList.remove(`hidden`)
    }

    btn.addEventListener(evType, () => {
      // check if context is in suspended state (autoplay policy)
      if (this.audioCtx.state === `suspended`) {
        this.audioCtx.resume()
      }

      this.isMuted ? this.unmute() : this.mute()
    }, false)
  }
}
