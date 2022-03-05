/** ------------------------------ 职责链模式 ------------------------------ **/
// 职责链模式的最大优点就是解耦了请求发送者和N个接收者之间的复杂关系
// 优势：使用了职责链模式之后，链中的节点对象可以灵活地拆分重组。增加或者删除一个节点，或者改变节点在链中的位置都是轻而易举的事情。

// 弊端：职责链模式使得程序中多了一些节点对象，可能在某一次的请求传递过程中，
// 大部分节点并没有起到实质性的作用，它们的作用仅仅是让请求传递下去，从性能方面考虑，我们要避免过长的职责链带来的性能损耗。
{
  console.log(`-----------bad code-----------\n`)

  function order(orderType, pay, stock) {
    if (orderType === '1') {
      if (pay) {
        console.log('500元定金预购，获得100元优惠卷')
      } else {
        if (stock > 0) {
          console.log('下单成功')
        } else {
          console.log('手机库存不足')
        }
      }
    } else if (orderType === '2') {
      if (pay) {
        console.log('200元定金预购，获得50元优惠券')
      } else {
        if (stock > 0) {
          console.log('下单成功')
        } else {
          console.log('手机库存不足')
        }
      }
    } else if (orderType === '3') {
      console.log('没有优惠卷，只能普通购买')
      if (stock > 0) {
        console.log('下单成功')
      } else {
        console.log('手机库存不足')
      }
    }
  }

  order('1', true, 500)
}

// 使用职责链模式
{
  console.log(`-----------职责链模式-----------\n`)

  function order500(orderType, pay, stock) {
    if (orderType === '1' && pay) {
      console.log('500元定金预购，获得100元优惠卷')
    } else {
      order200(orderType, pay, stock)
    }
  }
  function order200(orderType, pay, stock) {
    if (orderType === '2' && pay) {
      console.log('200元定金预购，获得50元优惠卷')
    } else {
      orderNormal(orderType, pay, stock)
    }
  }
  function orderNormal(orderType, pay, stock) {
    if (stock > 0) {
      console.log('下单成功')
    } else {
      console.log('手机库存不足')
    }
  }

  order500('1', true, 500)
  order500('1', false, 0)
  order500('1', false, 500)
  order500('2', true, 500)
  order500('2', false, 0)
  order500('2', false, 500)
  order500('3', true, 500)
}

// 更优秀的职责链
{
  console.log(`-----------更优秀的职责链-----------\n`)

  function Chain(fn) {
    this.fn = fn
    this.succesor = null
  }

  Chain.prototype.setNextSuccessor = function (succesor) {
    return (this.succesor = succesor)
  }

  Chain.prototype.passRequest = function () {
    this.fn.apply(this, arguments)
  }

  Chain.prototype.next = function () {
    return (
      this.succesor && this.succesor.passRequest.apply(this.succesor, arguments)
    )
  }

  const chain500 = new Chain(function (orderType, pay, stock) {
    let self = this
    if (orderType === '1' && pay) {
      console.log('500元定金预购，获得100元优惠卷')
    } else {
      self.next(orderType, pay, stock)
    }
  })
  const chain200 = new Chain(function (orderType, pay, stock) {
    let self = this
    if (orderType === '2' && pay) {
      console.log('200元定金预购，获得50元优惠卷')
    } else {
      self.next(orderType, pay, stock)
    }
  })
  const chainNormal = new Chain(function (orderType, pay, stock) {
    if (stock > 0) {
      console.log('下单成功')
    } else {
      console.log('手机库存不足')
    }
  })

  chain500.setNextSuccessor(chain200)
  chain200.setNextSuccessor(chainNormal)

  order('1', true, 500)
  order('1', false, 0)
  order('1', false, 500)
  order('2', true, 500)
  order('2', false, 0)
  order('2', false, 500)
  order('3', true, 500)
}

{
  console.log(`-----------利用AOP实现职责链模式-----------\n`)
  Function.prototype.after = function (fn) {
    let self = this
    return function () {
      const ret = self.apply(this, arguments)
      if (ret === 'next') {
        return fn.apply(this, arguments)
      }
      return ret
    }
  }

  function chain500(orderType, pay, stock) {
    if (orderType === '1' && pay) {
      console.log('500元定金预购，获得100元优惠卷')
    } else {
      return 'next'
    }
  }
  function chain200(orderType, pay, stock) {
    if (orderType === '2' && pay) {
      console.log('200元定金预购，获得50元优惠卷')
    } else {
      return 'next'
    }
  }
  function chainNormal(orderType, pay, stock) {
    if (stock > 0) {
      console.log('下单成功')
    } else {
      console.log('手机库存不足')
    }
  }

  const order = chain500.after(chain200).after(chainNormal)

  order('1', true, 500)
  order('1', false, 0)
  order('1', false, 500)
  order('2', true, 500)
  order('2', false, 0)
  order('2', false, 500)
  order('3', true, 500)
}
