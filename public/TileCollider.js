`use strict`
import TileResolver from './TileResolver.js'
import { SIDES } from './Entity.js'

class TileCollider {
  constructor(collisionGrid) {
    this.collisionGrid = new TileResolver(collisionGrid)
  }

  checkX(entity, lvl) {
    let x

    if (entity.vel.x > 0) x = entity.bounds.right
    else if (entity.vel.x < 0) x = entity.bounds.left
    else return

    const matches = this.collisionGrid.searchByRange(
      x, x,
      entity.bounds.top,
      entity.bounds.bottom
    )

    matches.forEach((match) => {
      // End scene.
      if (match.tile.type === `door` && entity.hasReachedEnd === false) {
        entity.hasReachedEnd = true

        entity.controls.removeListeners()
        entity.run.direction = 0

        lvl.end()
      }
      // Skip non-blocking types.
      if (match.tile.type !== `ground`) return

      // Check for collision on the right side.
      if (entity.vel.x > 0) {
        if (entity.bounds.right > match.xLeft) {
          entity.bounds.left = match.xLeft - entity.size.x
          entity.vel.x = 0
        }

        entity.obstruct(SIDES.RIGHT)
      }
      // Check for collision on the left side.
      else if (entity.vel.x < 0) {
        if (entity.bounds.left < match.xRight) {
          entity.bounds.left = match.xRight
          entity.vel.x = 0
        }

        entity.obstruct(SIDES.LEFT)
      }
    })
  }

  checkY(entity, lvl) {
    let y

    if (entity.vel.y > 0) y = entity.bounds.bottom
    else if (entity.vel.y < 0) y = entity.bounds.top
    else return

    const matches = this.collisionGrid.searchByRange(
      entity.bounds.left, entity.bounds.right,
      y, y
    )

    matches.forEach((match) => {
      // Skip non-blocking types.
      if (match.tile.type !== `ground`) return

      // Check for collision below.
      if (entity.vel.y > 0) {
        if (entity.bounds.bottom > match.yTop) {
          entity.bounds.top = match.yTop - entity.size.y
          entity.vel.y = 0

          entity.obstruct(SIDES.BOTTOM)
        }
      }
      // Check for collision above.
      else if (entity.vel.y < 0) {
        if (entity.bounds.top < match.yBottom) {
          entity.bounds.top = match.yBottom
          entity.vel.y = 0

          entity.obstruct(SIDES.TOP)

          if (match.tile.destroyable) {
            const { audioControls, interactionGrid } = lvl
            const x = this.collisionGrid.toIndex(match.xLeft)
            const y = this.collisionGrid.toIndex(match.yTop)

            audioControls.play(`break`)

            interactionGrid.set(x, y, {
              ...match.tile,
              touchedAt: lvl.totalTime
            })
            this.collisionGrid.matrix.set(x, y, {
              ...match.tile,
              // Unset type to prevent collision.
              type: undefined,
            })
          }

          if (match.tile.withCoin) {
            const { audioControls, interactionGrid } = lvl
            const { name } = match.tile
            const x = this.collisionGrid.toIndex(match.xLeft)
            const y = this.collisionGrid.toIndex(match.yTop)

            audioControls.play(`coin`)

            interactionGrid.set(x, y, {
              ...match.tile,
              name: `${name}_off`,
              touchedAt: lvl.totalTime,
            })
            this.collisionGrid.matrix.set(x, y, {
              ...match.tile,
              withCoin: false,
            })
          }
        }
      }
    })
  }
}

export default TileCollider
