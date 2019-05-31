`use strict`

const createCameraLayer = (camToDraw) => {
  return function drawCameraRect(ctx, fromCam) {
    ctx.strokeStyle = `lime`
    ctx.beginPath()
    ctx.rect(
      camToDraw.pos.x - fromCam.pos.x,
      camToDraw.pos.y - fromCam.pos.y,
      camToDraw.size.x,
      camToDraw.size.y
    )
    ctx.stroke()
  }
}
export default createCameraLayer
