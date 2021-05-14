## Event Loop是什么？
Event Loop（事件循环）是一种执行机制，其实不只是js语言有这种机制，其它语言也有这种机制。\
js作为一种单线程语言，意味着它在同一时间只能做一件事，即同步执行。如在alert后写上再多的console.log，只要alert不关闭，就轮不到console.log执行。\
js虽然是单线程的，但其有同步和异步的概念。\
浏览器环境和node环境有差别。
## 同步任务和异步任务
js里同步任务执行完毕，便会返回结果给调用者，如：
```javascript
console.log('a'); //控制台立即打印出'a'
```
异步任务一执行，就会返回任务完成给调用者，js可以继续往下执行。但调用者不一写能拿到预期的结果，如：
```javascript
let res;
$.get('/async', function (data) {
  res = data
})
console.log(res)  //res不一定有值，这就没有得到预期效果
```
js执行过程中，遇到异步任务，则会将异步任务推入任务队列中，之后继续执行下面任务，这样就不会造成线程的阻塞，但这也可能不能立即得到异步任务所取得的预期效果。
## 任务队列
js作为单线程语言，一条主线程从头执行到尾，同步任务会在主线程一个一个的按顺序执行，如果遇到异步任务，js会将异步任务推入任务队列中，等主线程的同步任务执行完毕，
再从任务队列中取出第一个任务推入主线程中，如此循环，直至任务队列为空，主线程执行完毕。这样的循环即事件循环，即Event Loop。
任务队列中又分**宏任务**和**微任务**，宏任务是一条单独队列，微任务一条单独队列，异步任务在推入任务队列时，宏任务推入宏队列，微任务推入微队列，宏队列和微队列
统称任务队列。常见的宏任务和微任务如下：
- 宏任务(macro-task)\
  script, setTimeout, setInterval, ...等
- 微任务(micro-task)\
  process.nextTick, Promise, ...等\
  注: Promise在则创建时是同步任务，其状态确定后的回调才是微任务(then或catch)\
举个:pear:
```javascript
setTimeout(function () {
  console.log(2)
}, 0)
console.log(1)
//打印顺序是1,2
//因为setTimeout是异步任务，在主线程有同步任务时并不会执行，而是被推入宏任务中
//当console.log(1)执行完毕，主线程空闲，宏任务就会被推入主线程中
```
**当宏任务和微任务共存时，每当需要切换到其它宏任务时，若微队列有任务，则会优先处理微任务，处理完毕后再切换到宏任务:exclamation:**
## Promise
> Promise 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值. --< MDN >
---
每新建一个Promise，被promise包裹的代码会立即执行，同时promise进入fullfill状态，再没有明确指定状态改变时，promise并不会执行相关回调。
```javascript
new Promise((resolve, reject) => {
  console.log(1)  // 立即执行，进入 fullfill 状态
  resolve(2)  // 若没有 resove 或 reject fullfill 状态不会改变
}).then(res => {
  // res 是 resolve 传下来的参数
  console.log(res)  // 2, promise 状态变为 resolve 会执行这个函数的回调
}).then(res => {
  console.log(res)  // undefined 多个 then 会同时执行，但 resolve 传的参数只会在第一层生效
}).reject(err => {
  // err 错误原因
  console.log(err)  // promise 状态变为 resolve 会执行这个函数的回调
})
```
### 取消 Promise
```javascript
// 通过 promise.race 取消
function wrap(p) {
  let obj = {};
  // 这里主要用了 promise.race 的特性
  // 当有一个 promise 状态改变后，与之一起 race 的 promise 都会被取消
  let p1 = new Promise((resolve, reject) => {
    // 将 promise 的 resolve, reject 方法外显
    obj.resolve = resolve;
    obj.reject = reject;
  });
  // 若内部函数不做任何操作，则返回外部的 promise
  // 当外部调用了 obj.reject，此时若外部没有执行
  obj.promise = Promise.race([p1, p]);
  return obj;
}

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 1000);
});
// 返回一个对象
let obj = wrap(promise);
obj.promise.then(res => {
  console.log(res);
});
obj.resolve("请求被拦截了");
obj.reject("请求被拒绝了");

//方法二 取消promise方法   新包装一个可操控的promise

function wrap(p) {
  let res = null;
  let abort = null;

  let p1 = new Promise((resolve, reject) => {
    // 将 promise 的 resolve, reject 方法外显
    res = resolve;
    abort = reject;
  });

  // 自定义变量暴露 reject
  p1.abort = abort;
  p.then(res, abort);

  return p1;
}

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 1000);
});
// 返回一个promise
let obj = wrap(promise);
obj.then(res => {
  console.log(res);
});
// 相当于 promise.reject()
obj.abort("请求被拦截");

// 参考：https://juejin.cn/post/6844904148899463175
```
## Event Loop 与 Promise
Promise刚创建时是同步对象，其里边的代码会立即执行\
举个:pear:
```javascript
setTimeout(function () {
  console.log(2)
}, 0)
new Promise(resovle=>{
  console.log(1)
  resolve() //若没有resolve或者reject去改变Promise的状态，则一直都是pedding
}).then(res => {
  console.log(3)
})
console.log(4)
//打印顺序是1,4,3,2
```
:arrow_up:主线程开始 -> setTimeout推入宏任务 -> promise创建，立即执行console.log(1), promise状态为resolve，产生微任务then，推入微队列
-> 主线程上执行console.log(4) -> 微队列有任务，将微队列的一个微任务推入主线程，执行console.log(3) -> 微队列为空，取出宏任务中的一个任务推入主线程
-> 执行console.log(4) -> 任务队列变空，执行完毕\
**不仅主线程会产生微任务，宏任务也会产生微任务，不管哪里产生的微任务，在宏任务切换之前，要先执行完微任务**\
再举个:pear:
```javascript
setTimeout(function () {
  console.log(5)
}, 0)
new Promise((resolve,reject) => {
  console.log(4)
	resolve(2)
}).then(res => {
	console.log(res)
  new Promise((resolve, reject) => {
    console.log(6)
    resolve(7)
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(8)
  })
}).then(res => {
	console.log(3)
})
console.log(1)
//打印顺序4,1,2,6,7,3,5
```
:arrow_up:主线程开始 -> setTimeout推入宏任务 -> promise内立即打印出4，同时将then推入微任务，then后面的then并未执行，原因是前一个then在再任务中赏未执行，状态为pedding，故后面那个then不会
马上推入微任务中 -> 主线程立即打印出1 -> 主线程空闲，检查微队列，立即打印出2，同时新的promise立即打印出6，将新promise的then推入微队列，此时本该为空的微队列又添加进新任务，继续执行微队列 ->
立即打印出7，由于第二个promise的状态变为resolve，故catch不会执行 -> 此时第一个promise的then执行完毕，返回undefined，第一个promise的then状态变成resolve，第二个then进入微队列
-> 执行微队列，打印出3，至此微队列全部执行完毕，切换宏任务 -> 打印出5 -> 任务队列为空，执行完毕\
**主线程执行完毕后，检查微队列，微队列为空才能执行宏队列，即使执行最后一个微任务时产生新的微任务，那也要执行完新产生的微任务**
## node 中的Event Loop
**node中的Event Loop在v10之前与浏览器的不尽相同，在v10之后和浏览器的Event Loop一致**\
node在执行时会初始化event loop，执行完每个阶段的宏任务，再处理process.nextTick和微任务\
node的宏任务如下按顺序执行：\
timers: 该阶段执行已经安排好的定时器和延时器的回调函数 -> \
I/O callback: 该阶段几乎执行所有回调函数，除了close callbacks以及timers调度的回调和setImmediate()调度的回调 -> \
idle, prepare: 只在内部使用(不是很理解) -> \
poll(轮询): 检索新的I/O事件，并执行其相应的回调 -> \
check: setImmediate的回调将会在这个阶段执行 -> \
close callbacks: 执行一些准备关闭的回调函数，比如socket.on('close', ...)\
node在v10之前，每个阶段任务处理完后才会处理process.nextTick和微任务，v10之后是处理完一个阶段中的一个任务，便会处理process.nextTick和微任务，与浏览器的一致
```javascript
function foo () {
  setTimeout(function () {
    console.log("a")
  }, 0)
  console.log("b")
  setTimeout(function () {
    console.log("c")
    process.nextTick(function () {
      console.log("d")
    })
  }, 0)
  Promise.resolve().then(function () {
    console.log("e")
  })
  console.log("f")
}
foo()
//v10之前
// b f e a c d (因为两个setTimeout处于同一任务阶段，只有该阶段执行完才会执行process.nextTick和微任务)
//process.nextTick的优先级大于微任务，先执行完process.nextTick再执行微任务

//v10之后，与浏览器一致（浏览器打印d会报错）
// b f e a c d

```

