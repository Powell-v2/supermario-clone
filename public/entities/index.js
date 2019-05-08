`use strict`
import { loadHero } from './hero.js'
import { loadGoomba } from './goomba.js'
import { loadKoopa } from './koopa.js'

export default async function loadEntities() {
  const factories = {}

  const addAs = (name) => (factory) => factories[name] = factory

  await Promise.all([
    loadHero(`mario`).then(addAs(`mario`)),
    loadHero(`luigi`).then(addAs(`luigi`)),
    loadGoomba().then(addAs(`goomba`)),
    loadKoopa().then(addAs(`koopa`)),
  ])

  return factories
}
