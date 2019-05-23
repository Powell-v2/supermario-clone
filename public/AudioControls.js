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
    this.isMuteButtonSetup = false

    this.sounds = new Map()
    this.loopedSounds = new Map()
    config.forEach((sound) => {
      const element = new Audio(`/public/assets/audio/${sound.name}.${sound.format}`)

      if (sound.loop) element.loop = true
      element.type = `audio/mpeg`
      element.autoplay = false

      this.sounds.set(sound.name, {
        audio: element,
        isMuted: false,
        ...sound,
      })
    })
  }

  play(name) {
    const { isMuted, audio, loop } = this.sounds.get(name)

    if (isMuted) return
    if (!audio.paused) return

    if (loop && !this.loopedSounds.has(name)) {
      this.loopedSounds.set(name, audio)

      return audio.play()
    }

    const clone = audio.cloneNode()
    clone.play()
  }

  muteOne(name) {
    const sound = this.sounds.get(name)

    if (sound.loop) {
      this.loopedSounds.get(name).pause()
    }
    this.sounds.set(name, {
      ...sound,
      isMuted: true,
    })
  }

  unmuteOne(name) {
    const sound = this.sounds.get(name)

    if (sound.loop) {
      this.loopedSounds.get(name).play()
    }

    this.sounds.set(name, {
      ...sound,
      isMuted: false,
    })
  }

  mute() {
    this.isMuted = true

    this.loopedSounds.forEach((sound) => sound.pause())

    this.sounds.forEach((sound) => {
      this.sounds.set(sound.name, {
        ...sound,
        isMuted: true,
      })
    })
  }

  unmute() {
    this.isMuted = false

    this.loopedSounds.forEach((sound) => sound.play())

    this.sounds.forEach((sound) => {
      this.sounds.set(sound.name, {
        ...sound,
        isMuted: false,
      })
    })
  }

  switchIcons() {
    muteOnIcon.classList.toggle(`hidden`)
    muteOffIcon.classList.toggle(`hidden`)
  }

  setupMuteButton(btn, evType) {
    if (this.isMuteButtonSetup) return

    // Initially both icons are hidden - show mute_off button on game start
    if (
      muteOffIcon.classList.contains(`hidden`) &&
      muteOnIcon.classList.contains(`hidden`)
    ) {
      muteOffIcon.classList.remove(`hidden`)
    }

    // Let the browser know that playback is trusted
    // by playing a sound on user interaction.
    const { audio } = this.sounds.get(`coin`)
    audio.muted = true
    audio.play()

    btn.addEventListener(evType, () => {
      this.isMuted ? this.unmute() : this.mute()
      this.switchIcons()
    })

    this.isMuteButtonSetup = true
  }
}
