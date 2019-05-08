`use strict`

export function isMobile() {
  const mobileOsList = new RegExp(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/,
    `i`
  )
  return (
    mobileOsList.test(navigator.userAgent) &&
    navigator.maxTouchPoints > 0
  )
}
