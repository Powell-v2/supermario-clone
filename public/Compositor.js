`use strict`

class Compositor {
  constructor() {
    this.layers = []
  }

  draw(ctx, cam) {
    this.layers.forEach((layer) => layer(ctx, cam))
  }

  destroy() {
    this.layers = []
  }
}

export default Compositor
