## Promise 基本
promise 有三种状态 pending, fulfilled, rejected, 一但触发 promise, promise 会立即进入 pending，且状态不受外部影响。通过触发 promise 内部的函数 resolve 或 reject 可以让 promise 进入下一个状态且执行回调函数（如果有的话）

## 实现 Promise 类 - 基础班
```js
class WPromise {
  // 定义 promise 状态
  static pending = 'pending'
  static fulfilled = 'fulfilled'
  static rejected = 'rejected'

  constructor(executor) {
    this.status = WPromise.pending // 初始化状态
    this.value = undefined  // 操作成功的返回值
    this.reason = undefined  // 操作失败的返回值
    this.callbacks = []
    // 立即执行函数，并将更改状态的两个函数作为参数传递
    executor(this._resolve.bind(this), this._reject.bind(this))
  }

  // 第一个函数是成功回调，第二个参数是失败回调
  // 调用 then 或者 catch 其实就是调用这些方法
  // 链式调用会马上执行这里面的方法
  // 所以不能马上执行传进来的函数，需要存起来
  then(onFulfilled, onRejected) {
    if (this.status === WPromise.pending) {
      this.callbacks.push({
        onFulfilled,
        onRejected
      })
    }
  }
  // 接受失败回调
  catch(onRejected) {
    if (this.status == WPromise.pending) {
      this.callbacks.push({onRejected})
    }
  }
  // 状态改变执行
  finally(onFinished) {
    if (this.status == WPromise.pending) {
      this.callbacks.push({onFinished})
    }
  }

  // all 的实现
  all(promises) {
    return new Promise(function(resolve, reject) {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('arguments must be an array'));
      }
      var resolvedCounter = 0;
      var promiseNum = promises.length;
      var resolvedValues = new Array(promiseNum);
      for (let i = 0; i < promiseNum; i++) {
        Promise.resolve(promises[i]).then(function(value) {
          resolvedCounter++
          resolvedValues[i] = value
          if (resolvedCounter == promiseNum) {
            return resolve(resolvedValues)
          }
        }, function(reason) {
          return reject(reason)
        })
      }
    })
  }

  // 改变状态的方法，只能通过这两个方法改变
  _resolve(value) {
    this.status = WPromise.fulfilled
    this.value = value
    this.callbacks.forEach(cb => this._handler(cb))
  }
  _reject(reason) {
    this.status = WPromise.rejected
    this.reason = reason
    this.callbacks.forEach(cb => this._handler(cb))
  }

  // 辅助函数
  _handler(callback) {
    const { onFulfilled, onRejected, onFinished } = callback
    if (this.status == WPromise.fulfilled && onFulfilled) {
      onFulfilled(this.value)
    }
    if (this.status == WPromise.rejected && onRejected) {
      onRejected(this.value)
    }
    if (this.status !== WPromise.pending && onFinished) {
      onFinished()
    }
  }
}

// 模拟请求
function fetchData(flag = 0) {
  console.log("fetching...")
  return new WPromise((resolve, reject) => {
    setTimeout(() => {
      if (flag == 1) {
        resolve('success!')
      } else {
        reject('error')
      }
    }, 1000)
  })
}
// 发起请求
fetchData(1).then(res => console.log(res))
fetchData().catch(err => console.log(err))
fetchData().finally(() => console.log("finished"))
```

## promise 的链式调用
在以上测试中可以发现会和官方的 Promse 很是不一样，不能同时调用 then, catch, finally, 甚至不能调用多次 then 之类的。想要实现链式调用，则执行 then, catch, finally 后，就需要再返回一个 promise，这样产生新的 promise 就能继续调用 then 这些了
**promise 链式调用的实现**
```js

class WPromise {

  // ...省略
  
  // 第一个函数是成功回调，第二个参数是失败回调
  // 调用 then 或者 catch 其实就是调用这些方法
  // 链式调用会马上执行这里面的方法
  // 所以不能马上执行传进来的函数，需要存起来
  then (onFulfilled, onRejected) {
    return new WPromise((nextResolve, nextReject) => {
      // 立即执行，同时判断状态对传进来的函数进行储存
      this._handler({
        nextResolve,
        nextReject,
        onFulfilled,
        onRejected
      })
    })
  }
  // 接受失败回调
  catch (onRejected) {
    return new WPromise((nextResolve, nextReject) => {
      this._handler({
       nextResolve,
        nextReject,
        onRejected
      })
    })
  }
  // 状态改变执行
  finally (onFinished) {
    return new WPromise((nextResolve, nextReject) => {
      this._handler({
        nextResolve,
        nextReject,
        onFinished
      })
    })
  }

  // ...省略
  // 修改辅助函数
  _handler(callback) {
    const { onFulfilled, onRejected, nextResolve, nextReject, onFinished } = callback;
    if (this.status === WPromise.pending) {
        this.callbacks.push(callback);
        return;
    }

    if (this.status === WPromise.fulfilled) {
        // 传入存储的值
        // 未传入onFulfilled时，将undefined传入
        const nextValue = onFulfilled ? onFulfilled(this.value) : undefined;
        nextResolve && nextResolve(nextValue)
        return 
    }
    if (this.status === WPromise.rejected) {
        // 传入存储的错误信息
        // 同样的处理
        onRejected && onRejected(this.reason)
        nextReject && nextReject(this.reason);
        return 
    }

    if (this.status !== WPromise.pending && onFinished) {
      onFinished()
    }
  }
}
// 发起请求
fetchData(1).then(res => console.log(res)).catch(err => console.log(err)).finally(() => console.log("fetch finished"))
fetchData().then(res => console.log(res)).catch(err => console.log(err)).finally(() => console.log("fetch finished"))
fetchData(1).then(res => {console.log(res); return 'to next'}).then((res) => console.log(res)).finally(() => console.log("link call finished"))
```

## 完整
```js
class WPromise {
  // 定义 promise 状态
  static pending = 'pending'
  static fulfilled = 'fulfilled'
  static rejected = 'rejected'


  constructor(executor) {
    this.status = WPromise.pending // 初始化状态
    this.value = undefined  // 操作成功的返回值
    this.reason = undefined  // 操作失败的返回值
    this.callbacks = []
    // 立即执行函数，并将更改状态的两个函数作为参数传递
    executor(this._resolve.bind(this), this._reject.bind(this))
  }

  // 第一个函数是成功回调，第二个参数是失败回调
  // 调用 then 或者 catch 其实就是调用这些方法
  // 链式调用会马上执行这里面的方法
  // 所以不能马上执行传进来的函数，需要存起来
  then (onFulfilled, onRejected) {
    return new WPromise((nextResolve, nextReject) => {
      // 立即执行，同时判断状态对传进来的函数进行储存
      this._handler({
        nextResolve,
        nextReject,
        onFulfilled,
        onRejected
      })
    })
  }
  // 接受失败回调
  catch (onRejected) {
    return new WPromise((nextResolve, nextReject) => {
      this._handler({
       nextResolve,
        nextReject,
        onRejected
      })
    })
  }
  // 状态改变执行
  finally (onFinished) {
    return new WPromise((nextResolve, nextReject) => {
      this._handler({
        nextResolve,
        nextReject,
        onFinished
      })
    })
  }

  // 改变状态的方法，只能通过这两个方法改变
  _resolve(value) {
    this.status = WPromise.fulfilled
    this.value = value
    this.callbacks.forEach(cb => this._handler(cb))
  }
  _reject(reason) {
    this.status = WPromise.rejected
    this.reason = reason
    this.callbacks.forEach(cb => this._handler(cb))
  }
  // 辅助函数
  _handler(callback) {
    const { onFulfilled, onRejected, nextResolve, nextReject, onFinished } = callback;
    if (this.status === WPromise.pending) {
        this.callbacks.push(callback);
        return;
    }

    if (this.status === WPromise.fulfilled) {
        // 传入存储的值
        // 未传入onFulfilled时，将undefined传入
        const nextValue = onFulfilled ? onFulfilled(this.value) : undefined;
        nextResolve && nextResolve(nextValue)
        // return 
    }
    if (this.status === WPromise.rejected) {
        // 传入存储的错误信息
        // 同样的处理
        const nextReason = onRejected ? onRejected(this.reason) : undefined;
        nextReject && nextReject(this.reason);
        // return 
    }

    if (this.status !== WPromise.pending && onFinished) {
      onFinished()
    }
  }
}

function fetchData(flag) {
    return new WPromise((resolve, reject) => {
        setTimeout(() => {
            if (flag) {
                resolve('success')
            } else {
                reject('error')
            }
        }, 1000)
    })
}

fetchData(1).then(res => {console.log(res); return 'bb'}).then(res => console.log(res + 'aaa'))
fetchData(0).then(null, res => console.log(res))
```