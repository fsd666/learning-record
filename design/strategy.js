/** ------------------------------ 策略模式 ------------------------------ **/

// 策略模式指的是定义一系列的算法，并且把它们封装起来。
// 在实际开发中，我们通常会把算法的含义扩散开来，使策略模式也可以用来封装一系列的“业务规则”。
// 只要这些业务规则指向的目标一致，并且可以被替换使用，我们就可以用策略模式来封装它们。

{
  // 多公司的年终奖是根据员工的工资基数和年底绩效情况来发放的。例如，绩效为S的人年终奖有4倍工资，
  // 绩效为A的人年终奖有3倍工资，而绩效为B的人年终奖是2倍工资。假设财务部要求我们提供一段代码，来方便他们计算员工的年终奖。

  // 定义奖金算法
  const strategies = {
    S: function (salary) {
      return salary * 4
    },
    A: function (salary) {
      return salary * 3
    },
    B: function (salary) {
      return salary * 2
    },
  }

  // 奖金计算方法
  const calculateBonus = function (level, salary) {
    return strategies[level](salary)
  }

  console.log(calculateBonus('S', 3000))
}
