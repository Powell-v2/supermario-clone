`use strict`

export const setupMouseControl = (scene, ent, cam) => {
  const events = [`mousedown`, `mousemove`]
  let lastEvent

  events.forEach((type) => {
    scene.addEventListener(type, (ev) => {
      const { offsetX, offsetY, buttons } = ev

      if (buttons === 1) {
        ent.vel.set(0, 0)
        ent.pos.set(
          offsetX + cam.pos.x,
          offsetY + cam.pos.y
        )
      }
      else if (
        buttons === 2 &&
        lastEvent &&
        lastEvent.buttons === 2 &&
        lastEvent.type === `mousemove`
      ) {
        cam.pos.x -= offsetX - lastEvent.offsetX
      }

      lastEvent = ev
    })
  })

  scene.addEventListener(`contextmenu`, (ev) => ev.preventDefault())
}
