/** ------------------------------ 适配器模式 ------------------------------ **/

// 适配器模式主要用来解决两个已有接口之间不匹配的问题，
// 它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够使它们协同作用。

// 一个简单的例子，调用百度地图和谷歌地图的展示方法

const googleMap = {
  show: () => {
    console.log('显示谷歌地图')
  },
}

// 第三方接口的定义不一定会一致，所以需要实现一个包装函数
const baiduMap = {
  display: () => {
    console.log('显示百度地图')
  },
}

const baiduMapAdapter = {
  show: () => {
    baiduMap.display()
  },
}

function render(map) {
  map && map.show()
}

render(googleMap)
render(baiduMapAdapter)
