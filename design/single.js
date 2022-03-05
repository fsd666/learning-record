/** ------------------------------ 单例模式 ------------------------------ **/
// 单例模式
// 单例模式的核心是确保只有一个实例，并提供全局访问

function Database(initValue = {}) {
  let that = this
  this.store = new Map()

  function init() {
    if (initValue === null || typeof initValue !== 'object') {
      throw TypeError('initValue must be an object type')
    }
    for (const key in initValue) {
      that.store.set(key, initValue[key])
    }
  }

  init()
}

Database.prototype.setValue = function (key, value) {
  this.store.set(key, value)
}

Database.prototype.getValue = function (key) {
  return this.store.get(key)
}
{
  // 代理函数
  // 违反了单一职责原则，将创建实例和管理实例写在了一起
  const ProxyCreateDatabase = (function () {
    let instance = null
    return function () {
      if (!instance) {
        instance = new Database()
      }
      return instance
    }
  })()

  const database_1 = new ProxyCreateDatabase()
  database_1.setValue('time', Date.now())
  const database_2 = new ProxyCreateDatabase()
  console.log('database_1', database_1.getValue('time'))
  console.log('database_2', database_2.getValue('time'))
}

{
  // 创建对象和管理单例的职责应该被分布在两个不同的方法中，这两个方法组合起来才具有单例模式的威力
  const getSingle = function (fn) {
    let instance = null
    return function () {
      return instance || (instance = fn.apply(this, arguments))
    }
  }

  function createDatabase() {
    return new Database({
      author: 'fansida',
    })
  }

  const createSingleDatabase = getSingle(createDatabase)

  const database_1 = createSingleDatabase()
  const database_2 = createSingleDatabase()
  console.log(database_1)
  database_1.setValue('age', 26)
  console.log('database_1', database_1.getValue('age'))
  console.log('database_2', database_2.getValue('age'))
}
