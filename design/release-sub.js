/** ------------------------------ 发布订阅模式 ------------------------------ **/

// 发布—订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

// 场景：假如售楼处的房子已经售罄，客户需要再下次有新房开盘的时候及时收到新房开盘的通知，实现一个发布订阅

class EventEmitter {
  subList = {}

  addListener(eventName, callback) {
    this.subList[eventName] = this.subList[eventName] || []
    const index = this.subList[eventName].push(callback) - 1

    return () => {
      this.subList[eventName].splice(index, 1)
    }
  }

  emit(eventName, ...args) {
    this.subList[eventName].forEach((cb) => cb(...args))
  }
}

class SaleOffices extends EventEmitter {
  constructor() {
    super()
  }
}

const saleOffices = new SaleOffices()

// 小明订阅88平新房开盘通知
saleOffices.addListener('squareMeter88', (price) => {
  console.log(`小明：新房开盘价${price}`)
})

// 小红订阅120平新房开盘通知
const xiaohongCloseSub = saleOffices.addListener('squareMeter120', (price) => {
  console.log(`小红：新房开盘价${price}`)
})

// 小兰订阅120平新房开盘通知
saleOffices.addListener('squareMeter120', (price) => {
  console.log(`小兰：新房开盘价${price}`)
})

// 88平新房开盘，通知客户
saleOffices.emit('squareMeter88', 2000000)

// 120平新房开盘，通知客户
saleOffices.emit('squareMeter120', 3000000)

// 小红取消订阅
xiaohongCloseSub()

// 新房上市，通知客户
saleOffices.emit('squareMeter120', 2000000)
