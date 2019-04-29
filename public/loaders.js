const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.addEventListener(`load`, () => resolve(img))
    img.src = url
  })
}

const loadLevel = (name) => {
  return fetch(`/levels/${name}.json`)
    .then((blob) => blob.json())
}

export {
  loadImage,
  loadLevel,
}
