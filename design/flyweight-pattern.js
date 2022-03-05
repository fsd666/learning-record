/** ------------------------------ 享元模式 ------------------------------ **/

// 享元（fyweight）模式是一种用于性能优化的模式，“fy”在这里是苍蝇的意思，意为蝇量级。享元模式的核心是运用共享技术来有效支持大量细粒度的对象。
// 享元模式要求将对象的属性划分为内部状态与外部状态（状态在这里通常指属性）
// 内部状态存储与对象内部，可以被共享。独立于具体的场景，通常不可变
// 外部状态取决于具体的场景，并根据场景而变化，无法被共享
// 享元模式是为解决性能问题而生的模式
{
  // 假设有个内衣工厂，目前的产品有50种男式内衣和50种女士内衣，为了推销产品，
  // 工厂决定生产一些塑料模特来穿上他们的内衣拍成广告照片。正常情况下需要50个男模特和50个女模特，然后让他们每人分别穿上一件内衣来拍照。

  // 不使用享元模式的情况下：
  {
    function Model(sex, underwear) {
      this.sex = sex
      this.underwear = underwear
    }

    Model.prototype.takePhoto = function () {
      console.log(`sex:${this.sex}_underwear:${this.underwear}`)
    }
    // 创建了100个对象
    // 50个男模特
    for (let i = 0; i < 50; i++) {
      const model = new Model('male', `underwear${i}`)
      model.takePhoto()
    }
    // 50个女模特
    for (let i = 0; i < 50; i++) {
      const model = new Model('female', `underwear${i}`)
      model.takePhoto()
    }
  }

  // 使用享元模式的情况下：
  {
    function Model(sex) {
      this.sex = sex
    }

    Model.prototype.takePhoto = function () {
      console.log(`sex:${this.sex}_underwear:${this.underwear}`)
    }

    // 只需创建两个对象，通过修改对象的外部状态实现对象的重塑
    const male = new Model('male')
    const famale = new Model('famale')
    // 50个男模特
    for (let i = 0; i < 50; i++) {
      male.underwear = `underwear${i}`
      male.takePhoto()
    }
    // 50个女模特
    for (let i = 0; i < 50; i++) {
      famale.underwear = `underwear${i}`
      famale.takePhoto()
    }
  }
}
