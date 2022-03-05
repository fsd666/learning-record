/** ------------------------------ 状态模式 ------------------------------ **/
// 状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变。
// 允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。
// 我们以逗号分割，把这句话分为两部分来看。第一部分的意思是将状态封装成独立的类，
// 并将请求委托给当前的状态对象，当对象的内部状态改变时，会带来不同的行为变化。

function createState() {}

function Light() {
  this.offState = new OffLight(this)
  this.strongState = new StrongLight(this)
  this.superStrongState = new SuperStrongLight(this)
  this.currentState = null
  this.button = null
}

Light.prototype.init = function () {
  let self = this
  // 初始化状态
  this.setState(this.offState)
  // 创建一个开关按钮
  const button = document.createElement('button')
  button.innerText = 'switch'
  this.button = document.body.appendChild(button)
  this.button.addEventListener('click', function () {
    self.currentState.toggle()
  })
}

Light.prototype.setState = function (state) {
  this.currentState = state
}

// 状态父类
function State() {}
State.prototype.toggle = function () {
  throw Error('父类的toggle方法必须被重写')
}

function OffLight(light) {
  this.light = light
}
OffLight.prototype = new State()
OffLight.prototype.toggle = function () {
  console.log('强光')
  this.light.setState(this.light.strongState)
}

function StrongLight(light) {
  this.light = light
}
StrongLight.prototype = new State()
StrongLight.prototype.toggle = function () {
  console.log('超强光')
  this.light.setState(this.light.superStrongState)
}

function SuperStrongLight(light) {
  this.light = light
}
SuperStrongLight.prototype = new State()
SuperStrongLight.prototype.toggle = function () {
  console.log('关灯')
  this.light.setState(this.light.offState)
}

const light = new Light()

light.init()
