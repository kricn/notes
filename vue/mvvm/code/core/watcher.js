import { Dep } from './observer.js'
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // key 是data中的属性名称
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb

    // 把 watcher 对象记录到 Dep 类的静态属性 target
    Dep.target = this
    // 触发劫持数据中的 get 方法，在 get 方法中会调用 dep.addSub
    // 这里若要能跑通，需要将劫持数据代理(proxy)到 vm 上
    // 也就是访问 vm 上的属性，实际访问的是劫持数据 data 上的属性
    this.oldValue = vm[key]
    
    Dep.target = null
  }

  // 当数据发生变化 的时候更新视图
  update () {
    let newValue = this.vm[this.key]
    if (this.oldValue == newValue) {
      return
    }
    this.cb(newValue)
  }
}

export {
  Watcher
}