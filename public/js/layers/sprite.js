`use strict`

const createSpriteLayer = (entities, width = 64, height = 64) => {
  const spriteBuff = document.createElement(`canvas`)
  const spriteBuffCtx = spriteBuff.getContext(`2d`)

  spriteBuff.width = width
  spriteBuff.height = height

  return function drawSpriteLayer(ctx, cam) {
    entities.forEach((ent) => {
      spriteBuffCtx.clearRect(0, 0, width, height)

      ent.draw(spriteBuffCtx)

      ctx.drawImage(
        spriteBuff,
        ent.pos.x - cam.pos.x,
        ent.pos.y - cam.pos.y
      )
    })
  }
}

export default createSpriteLayer
