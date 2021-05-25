class Observe {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
     // 1. 判断data是否是对象
     if (!data || typeof data != 'object') {
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(obj, key, val) {
    let that = this
    // 如果val是对象，把val内部的属性转换成响应式数据
    this.walk(val)
    // 负责收集依赖，并发送通知
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
          Dep.target && dep.addSub(Dep.target)
          return val
      },
      set (newValue) {
        if (newValue == val) {
            return
        }
        val = newValue
        that.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })
  }
}

class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = []
  }

  static target = null

  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      console.log('添加观察者')
      this.subs.push(sub)
    }
  }

  // 发送通知
  notify() {
    console.log('通知订阅')
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

export {
  Observe,
  Dep
}