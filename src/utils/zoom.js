// 缩放
const getZoom = ()=> {
  let zoom = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
  // console.log("当前浏览器zoom值", zoom)

  if (zoom != 1) {
    // console.log("系统检测到您的设备对显示进行改变，可能导致页面显示不全,请调整后打开")
    // Message.error("系统检测到您的设备对显示进行改变，可能导致页面显示不全,请调整后打开");

    // document.body.style.zoom = -0.6 * zoom + 1.55;
    document.body.style.zoom = 1/zoom;
  } else {
    document.body.style.zoom = 1
  }

  // console.log("调整后zoom值", document.body.style.zoom)
}

// 初始化
// getZoom()

// 改变窗口大小时重新设置 rem
window.onresize = function () {
  // getZoom()
}
