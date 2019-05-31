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

    this.config = config
  }

  play(name) {
    const { isMuted, loop, audio } = this.sounds.get(name)

    if (isMuted) return

    if (loop && !this.loopedSounds.has(name)) {
      this.loopedSounds.set(name, audio)
    }

    audio.play()
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

  prepareSoundsForInitialization() {
    const init = () => {
      this.config.forEach((sound) => {
        const audio = new Howl({
          src: [`/public/assets/audio/${sound.name}.${sound.format}`]
        })

        if (sound.loop) audio.loop(true)

        this.sounds.set(sound.name, {
          audio,
          isMuted: false,
          ...sound,
        })
      })

      document.removeEventListener('touchstart', init, true)
      document.removeEventListener('touchend', init, true)
      document.removeEventListener('click', init, true)
    }

    document.addEventListener('touchstart', init, true);
    document.addEventListener('touchend', init, true);
    document.addEventListener('click', init, true);
  }

  setupMuteButton(btn, evType) {
    if (this.isMuteButtonSetup) return

    btn.addEventListener(evType, () => {
      this.isMuted ? this.unmute() : this.mute()
      this.switchIcons()
    })

    this.isMuteButtonSetup = true
  }
}
