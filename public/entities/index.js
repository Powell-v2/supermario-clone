`use strict`
import { loadMario } from './mario.js'
import { loadGoomba } from './goomba.js'
import { loadKoopa } from './koopa.js'

export default async function loadEntities() {
  const factories = {}

  const addAs = (name) => (factory) => factories[name] = factory

  await Promise.all([
    loadMario().then(addAs(`mario`)),
    loadGoomba().then(addAs(`goomba`)),
    loadKoopa().then(addAs(`koopa`)),
  ])

  return factories
}
