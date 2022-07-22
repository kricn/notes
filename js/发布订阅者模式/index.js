class EventEmmiter {

  constructor() {
    this.events = new Map()
  }

  /**
   * 
   * @param {string} eventName 事件名
   * @param {Function} callback 回调函数
   * @param {Object} context 上下文
   * @returns 
   */
  on(eventName, callback, context) {
    const events = this.events.get(eventName)
    if (typeof callback !== 'function') return;
    this.events.set(eventName, !events ? [{
      fn: callback,
      context
    }] : [...events, {
      fn: callback,
      context
    }])
    return this
  }

  /**
   * 
   * @param {string} eventName 事件名
   * @param  {...any} args 传参
   * @returns 
   */
  emit(eventName, ...args) {
    const events = this.events.get(eventName)
    if (!events) return;
    for (const event of events) {
      if (typeof event.fn === 'function') {
        event.fn.apply(event.context, [...args])
      }
    }
    return this
  }

  /**
   * 
   * @param {string} eventName 事件名
   * @param {Function} callback 回调函数
   * @returns 
   */
  off(eventName, callback) {
    // 取出订阅函数列表
    let events = this.events.get(eventName)
    // 定义数组
    let liveEvents = []

    if (events && callback) {
      for (let i = 0; i < events.length; i++) {
        // 重新设置新数组
        if (events[i].fn !== callback && events[i].fn._ !== callback) {
          liveEvents.push(events[i])
        }
      }
    }
    // 判断新数组中是否存在，如果长度不为0，那么直接讲新数组设置为新的订阅名称的仓库
    // 长度为0的话，说明没有被筛选中函数，直接将订阅项删除
    (liveEvents.length) ? this.events.set(eventName, liveEvents): this.events.delete(eventName)
    return this
  }

  /**
   * 只监听一次
   * @param {string} eventName 事件名
   * @param {Function} callback 回调函数
   * @param {object} context 上下问对象
   * @returns 
   */
  once(eventName, callback, context) {
    // once 不直接保留原来的函数
    // 保留原来的函数需要执行完删除监听
    let self = this
    // 调用 once 后不应该马上删除，而是应该在触发的时候删除
    function listener() {
      // 执行后马上删除
      self.off(eventName, listener)
      callback.apply(context, arguments)
    }
    // 保留原来的函数
    listener._ = callback
    return this.on(eventName, listener, context)
  }

}

const e = new EventEmmiter()


function trigger(res) {
  console.log(res)
}

function click(res1, res2) {
  console.log(res1, res2)
}

e.on("click", click).once('trigger', trigger)

// e.off("trigger", trigger)

e.emit("trigger", 'b')
e.emit("trigger", 'b')
e.emit("trigger", 'b')

// e.off('click', click)

e.emit("click", 'a', "c")
e.emit("click", 'b')