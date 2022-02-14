// Node事件循环
// 在进程启动时，Node会启动一个类似while(true)的循环，每次循环称为一个Tick
// Tick的过程就是查看是否有事件处理，如果有，则取出事件和相应的回调，如果存在关联的回调函数，就执行他们
// 事件循环阶段
// 定时器：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
// 待定回调：执行延迟到下一个循环迭代的 I/O 回调。
// idle, prepare：仅系统内部使用。
// 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate() 调度的之外），其余情况 node 将在适当的时候在此阻塞。
// 检测：setImmediate() 回调函数在这里执行。
// 关闭的回调函数：一些关闭的回调函数，如：socket.on('close', ...)。

{
  // nextTick拥有最高的执行优先级 属于idle观察者
  // 在每轮循环中会将保存在数组中的回调函数全部执行
  // 在下一个事件循环滴答开始之前调用此函数
  process.nextTick(() => {
    console.log('nextTick1')
  })

  process.nextTick(() => {
    console.log('nextTick2')
  })

  // 这里的时间所指的是回调函数进入事件队列的时间
  // 在每轮循环中执行链表中的一个回调函数
  // setTimeout、setInterval都属于timer观察者
  setTimeout(() => {
    console.log('setTimeout1')
    process.nextTick(() => {
      console.log('nextTick3')
    })
  }, 500)

  setTimeout(() => {
    console.log('setTimeout2')
  }, 1000)

  // 属于check观察者，在check阶段执行链表中的一个回调函数
  setImmediate(() => {
    console.log('setImmediate1')
  })
}

{
  // 耗时的同步任务会使定时器不精确
  const syncFunc = () => {
    const time = new Date().getTime()
    while (true) {
      if (new Date().getTime() - time > 2000) {
        break
      }
    }
    console.log(2)
  }

  // 1秒后放入事件队列
  setTimeout(() => {
    // 主线程被阻塞了2秒，2秒后主线程查看事件队列时执行该回调函数
    console.log('被阻塞的事件')
  }, 1000)
  console.log(1)
  // 同步任务执行了2秒
  syncFunc()
  console.log(3)
}
