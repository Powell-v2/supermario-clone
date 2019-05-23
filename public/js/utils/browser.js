`use strict`

export function isMobile() {
  const mobileOsList = new RegExp(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/,
    `i`
  )
  return (
    mobileOsList.test(navigator.userAgent) &&
    // Work around Safari's lack of support for `maxTouchPoints` prop
    (navigator.maxTouchPoints ? navigator.maxTouchPoints > 0 : true)
  )
}
