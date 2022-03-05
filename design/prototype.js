/** ------------------------------ 原型模式 ------------------------------ **/

// 原型模式
// 原型模式的真正目的并非在于需要得到一个一模一样的对象，而是提供了一种便捷的方式去创建某个类型的对象，克隆只是创建这个对象的过程和手段。
// 在JavaScript语言中不存在类的概念，对象也并非从类中创建出来的，所有的JavaScript对象都是从某个对象上克隆而来的。
// JavaScript给对象提供了一个名为__proto__的隐藏属性，某个对象的__proto__属性默认会指向它的构造器的原型对象，即{Constructor}.prototype。
// 如果对象无法响应某个请求，它会把这个请求委托给它的构造器的原型

// 手写一个new操作符
{
  function objectFactroy() {
    console.log(arguments)
    const obj = new Object()
    // 取出构造器
    const Constructor = [].shift.call(arguments)
    // 指向正确的原型
    obj.__proto__ = Constructor.prototype
    Constructor.apply(obj, arguments)
    return obj
  }

  function Person(name) {
    this._name = name
  }

  const person = objectFactroy(Person, 'fansida')
  console.log(person._name)
}
