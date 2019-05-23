`use strict`
import { loadHero } from './hero.js'

export default async function loadEntities() {
  const factories = {}

  const addAs = (name) => (factory) => factories[name] = factory

  await Promise.all([
    loadHero(`alan`).then(addAs(`alan`)),
    loadHero(`adamek`).then(addAs(`adamek`)),
    loadHero(`joe`).then(addAs(`joe`)),
    loadHero(`rob`).then(addAs(`rob`)),
  ])

  return factories
}
