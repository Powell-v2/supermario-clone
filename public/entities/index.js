`use strict`
import { loadHero } from './hero.js'
// import { loadGoomba } from './goomba.js'
// import { loadKoopa } from './koopa.js'

export default async function loadEntities() {
  const factories = {}

  const addAs = (name) => (factory) => factories[name] = factory

  await Promise.all([
    loadHero(`alan`).then(addAs(`alan`)),
    loadHero(`adam`).then(addAs(`adam`)),
    loadHero(`joe`).then(addAs(`joe`)),
    loadHero(`rob`).then(addAs(`rob`)),
  ])

  return factories
}
