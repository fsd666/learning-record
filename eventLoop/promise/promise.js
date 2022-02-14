// Promise/Deferred模式
// Promise/A+
// Promise拥有3种状态：未完成态、完成态和失败态
// Promise的状态只能由未完成态转换为完成态或者失败态，不能逆反。完成态和失败态不可互相转化
// Promise的状态一旦转化，将不可更改
const UNFULFILLED = 'unfulfilled'
const FULFILLED = 'fulfilled'
const FALID = 'faild'

function Promise(executor) {
  let that = this
  this.state = UNFULFILLED
  this.value = null
  this.reason = null
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  function resolve(value) {
    if (that.state === UNFULFILLED) {
      that.state = FULFILLED
      that.value = value
      that.onFulfilledCallbacks.forEach((cb) => cb(that.value))
    }
  }

  function reject(reason) {
    if (that.state === UNFULFILLED) {
      that.state = FALID
      that.reason = reason
      that.onRejectedCallbacks.forEach((cb) => cb(that.reason))
    }
  }

  // 触发执行器
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

// 解析then的返回值，实现链式调用
function resolvePromise(promise, x, resolve, reject) {
  // 如果promise和x指向同一个对象 则抛出错误
  // 防止循环引用
  if (promise === x) {
    return reject(new TypeError('promise and x refer to the same object'))
  }

  // 如果x是一个promise实例，则采用它的状态
  if (x instanceof Promise) {
    x.then(function (y) {
      resolvePromise(promise, y, resolve, reject)
    }, reject)
  } else if (typeof x === 'object' || typeof x === 'function') {
    // 如果x是一个object或function

    if (x === null) {
      return resolve(x)
    }

    let then
    try {
      // 如果检索属性x.then导致抛出异常e，则以e为原因拒绝promise
      then = x.then
    } catch (e) {
      return reject(e)
    }
    if (typeof then === 'function') {
      // // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
      let called = false
      try {
        then.call(
          x,
          function (y) {
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject)
          },
          function (r) {
            if (called) return
            called = true
            reject(r)
          },
        )
      } catch (e) {
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return
        reject(e)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

// then里面的FULFILLED/REJECTED状态时 为什么要加setTimeout ?
// 原因:
// 其一 2.2.4规范 要确保 onFulfilled 和 onRejected 方法异步执行(且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行) 所以要在resolve里加上setTimeout
// 其二 2.2.6规范 对于一个promise，它的then方法可以调用多次.（当在其他程序中多次调用同一个promise的then时 由于之前状态已经为FULFILLED/REJECTED状态，则会走的下面逻辑),所以要确保为FULFILLED/REJECTED状态后 也要异步执行onFulfilled/onRejected
// 总之就是让then方法异步执行 也就是确保onFulfilled/onRejected异步执行

// then方法始终返回一个新的promise

Promise.prototype.then = function (onFulfilled, onRejected) {
  // 如果onFulfilled不是函数，给一个默认函数，返回value
  // 后面返回新promise的时候也做了onFulfilled的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  let realOnFulfilled = onFulfilled
  if (typeof realOnFulfilled !== 'function') {
    realOnFulfilled = function (value) {
      return value
    }
  }

  // 如果onRejected不是函数，给一个默认函数，返回reason的Error
  // 后面返回新promise的时候也做了onRejected的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  let realOnRejected = onRejected
  if (typeof realOnRejected !== 'function') {
    realOnRejected = function (reason) {
      throw reason
    }
  }

  let promise2
  if (this.state === FULFILLED) {
    promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 如果onFulfilled不是一个function且promise1完成，那么promise2的值等于promise1的值
          if (typeof onFulfilled !== 'function') {
            resolve(this.value)
          } else {
            const x = realOnFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
    return promise2
  }

  if (this.state === FALID) {
    promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 如果onRejected不是一个function且promise1失败，那么promise2也必须失败，失败原因和promise1一致
          if (typeof onRejected !== 'function') {
            reject(this.reason)
          } else {
            const x = realOnRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    })
    return promise2
  }

  if (this.state === UNFULFILLED) {
    promise2 = new Promise((resolve, reject) => {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.value)
            } else {
              const x = realOnFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (e) {
            reject(e)
          }
        })
      })
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.reason)
            } else {
              const x = realOnRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (e) {
            reject(e)
          }
        })
      })
    })
    return promise2
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

Promise.resolve = function (value) {
  if (value instanceof Promise) {
    return value
  }
  return new Promise((resolve) => {
    resolve(value)
  })
}

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}

// 该方法用于将多个promise包装为一个promise
// 当所有promise成功时才触发回调函数，有一个失败则全部失败。
// 返回值根据传入的promise顺序排列
Promise.all = function (values) {
  if (!(values instanceof Array)) {
    throw TypeError(
      'undefined is not iterable (cannot read property Symbol(Symbol.iterator))',
    )
  }
  return new Promise((resolve, reject) => {
    const results = []
    let count = values.length
    if (count === 0) {
      return resolve(results)
    }
    values.forEach((p, index) => {
      p.then(
        (value) => {
          count--
          results[index] = value
          if (count === 0) {
            resolve(results)
          }
        },
        (error) => {
          reject(error)
        },
      )
    })
  })
}

// 将多个promise实例包装为一个promise实例
// 返回最先完成的promise的值
Promise.race = function (values) {
  if (!(values instanceof Array)) {
    throw TypeError(
      'undefined is not iterable (cannot read property Symbol(Symbol.iterator))',
    )
  }
  return new Promise((resolve, reject) => {
    if (values.length === 0) {
      // 如果接收到的是一个空数组 则会一直挂起
      return
    }
    values.forEach((p) => {
      p.then(
        (value) => {
          resolve(value)
        },
        (error) => {
          reject(error)
        },
      )
    })
  })
}

// 该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。
// 只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束。
Promise.allSettled = function (values) {
  if (!(values instanceof Array)) {
    throw TypeError(
      'undefined is not iterable (cannot read property Symbol(Symbol.iterator))',
    )
  }
  return new Promise((resolve) => {
    const results = []
    let count = values.length
    if (count === 0) {
      return resolve(results)
    }
    values.forEach((promise, index) => {
      promise.then(
        (value) => {
          count--
          results[index] = {
            status: promise.state,
            value,
          }
          if (count === 0) {
            resolve(results)
          }
        },
        (reason) => {
          count--
          results[index] = {
            status: promise.state,
            reason,
          }
          if (count === 0) {
            resolve(results)
          }
        },
      )
    })
  })
}

// finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason
      }),
  )
}

// 错误捕获
Promise.prototype.catch = function (rejected) {
  return this.then(null, rejected)
}

module.exports = Promise
