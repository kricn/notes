class Observe {
  constructor(data) {
    this.walk(data)
  }
  // 遍历 data 中的属性，递归找到全部的对象
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
  // 劫持 data 数据
  defineReactive(obj, key, val) {
    let that = this
    // 如果val是对象，把val内部的属性转换成响应式数据
    this.walk(val)
    // 负责收集依赖，并发送通知
    // 每个 data 中的 key 都会有个独立的 dep
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
          // 收集依赖
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
        // 通知依赖中的 watcher 去更新视图
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