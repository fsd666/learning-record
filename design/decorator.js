/** ------------------------------ 装饰器模式 ------------------------------ **/
// 给对象动态地增加职责的方式，称为装饰器模式
// 装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。
// 装饰器和代理模式的区别：装饰器模式更加灵活，通过动态的为对象增加职责，强化对象的功能，和对象完全解耦。代理模式通过拦截请求，实现自定义的操作，实际上和原函数所要达到的目的是一致的。

// 飞机大战，在不断的战斗过程中获取经验，飞机得到提升获得更猛的火力
{
  function Plane() {}

  Plane.prototype.fire = function () {
    console.log('普通射击')
  }

  function GuidedMissile(plane) {
    this.plane = plane
  }
  GuidedMissile.prototype.fire = function () {
    this.plane.fire()
    console.log('发射导弹')
  }

  function AtomicBomb(plane) {
    this.plane = plane
  }
  AtomicBomb.prototype.fire = function () {
    this.plane.fire()
    console.log('发射原子弹')
  }

  let plane = new Plane()
  plane = new GuidedMissile(plane)
  plane = new AtomicBomb(plane)

  plane.fire()
}

{
  // AOP 面向切面编程
  Function.prototype.before = function (beforeFn) {
    let self = this // 保持原函数的引用
    return function () {
      beforeFn.apply(this, arguments) // 执行新函数，且保证this不被劫持，新函数接收的参数
      return self.apply(this, arguments) // 执行原函数并返回结果
    }
  }

  Function.prototype.after = function (afterFn) {
    let self = this // 保持原函数的引用
    return function () {
      const ret = self.apply(this, arguments) // 执行原函数并返回结果
      afterFn.apply(this, arguments)
      return ret
    }
  }

  function dialog(msg) {
    console.log(msg)
  }

  const dialogWrapperBefore = dialog.before(function (msg) {
    console.log(msg, 'before')
  })

  const dialogWrapperAfter = dialog.after(function (msg) {
    console.log(msg, 'after')
  })

  dialogWrapperBefore('before input')
  dialogWrapperAfter('after input')
}
