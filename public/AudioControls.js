`use strict`

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

  mute() {
    this.isMuted = true

    for (const el of Object.values(this.audioElems)) {
      if (el.loop) el.pause()
    }
  }

  unmute() {
    this.isMuted = false

    for (const el of Object.values(this.audioElems)) {
      if (el.loop) el.play()
    }
  }

  setupMuteButton(btn, evType) {
    const muteOffIcon = document.querySelector(`.mute--off`)
    const muteOnIcon = document.querySelector(`.mute--on`)
    muteOffIcon.classList.toggle(`hidden`)

    btn.addEventListener(evType, () => {
      // check if context is in suspended state (autoplay policy)
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume()
      }

      // mute/unmute track depending on state
      if (btn.dataset.muted === 'no') {
        this.mute()
        btn.dataset.muted = 'yes'
      }
      else if (btn.dataset.muted === 'yes') {
        this.unmute()
        btn.dataset.muted = 'no'
      }

      muteOffIcon.classList.toggle(`hidden`)
      muteOnIcon.classList.toggle(`hidden`)
    }, false)
  }
}
