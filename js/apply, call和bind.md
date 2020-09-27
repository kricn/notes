## apply
apply用于改变函数对象里this的指向。第一个参数是需要改变this指向的对象，第二个参数是一个数组。
```javascript
//foo函数里并没有name属性,全局也没有name属性
function foo () {
  console.log(this.myname)
  console.log(this)
}
foo()  //此时foo中的this指向window(非严格模式下)，打印undefined和window对象
let obj = { myname: 'kricn' }
foo.apply(obj)  //打印出kricn和obj对象
```
foo调用apply后，其内部的this指向指向apply的第一个参数，这里即是obj，
obj里有myname属性，故打印出kricn, this也是指向obj对象
apply接收的第二个参数需要是数组类型，最后这个数据类型的参数会以单个形式传递给foo
```javascript
function foo (a, b) {
  console.log(this.myname)
  console.log(this)
  console.log(a)
  console.log(b)
  cosnole.log(arguments)
}
foo.apply({myname: 'kricn'}, [1,2,3])
/*
打印结果
kricn
{myname: 'kricn'}
1
2
Arguments(3)
*/
```
这里传入长度为三的数组，相当于向foo传入了三个参数1,2,3并将foo的this指向{myname:'kricn'}后执行函数
## call
和apply的作用一样，不同的是call从第二个参数起接受单个参数
```javascript
foo.call(obj, 1, 2, 3)
```
参数确定数量用call，不确定用apply，通过push入数组传递进去，
也可以通过循环arguments来拿到全部参数
## bind
bind的作用与call和apply一样，bind的传参和call一样。\
bind与call和apply的区别是其返回一个函数，而apply和call是立即调用。
```javascript
let fn = foo.bind(obj)
fn()  //这样才算真正调用
```
多次调用bind是无效的，即(foo.bind(obj1).bind(obj2).bind(obj3))(); foo的this只想obj1，后面两个bind无效，
原因是bind的实现方式，见下文。
## apply, call和bind的实现
**apply的实现**
```javascript
//参数context即所要指向的对象，就是对应上文obj
Function.prototype.myApply = function (context) {
  //判断是不是函数在调用这个方法
  if(typeof this !== 'function') throw new Error(`${this} is not a function`)
  //调用这个方法的函数可能有返回值
  let res = undefined;
  //this是个函数，即调用myApply的函数，将其赋给context的一个属性，改变函数内部this指向
  context.fn = this;
  //给context一个默认值，没有传参的话就指向window,在node环境下就是object
  context = context || window
  //获取除context之外的其他参数，可能有也可能没有
  let args = arguments[1] //arguments的第一个是context
  if(args) {
    //this本身就是一个函数，通过es6语法将数组展开传入this函数
    //其实就是context在调用函数，这样调用函数的this自然指向调用它的对象，即context
    res = context.fn(...args)
  }else{
    //若没有其他参数，直接执行this函数即可
    context.fn()
  }
  //返回res
  return res
} 
```
**call的实现**
```javascript
//参数context即所要指向的对象，就是对应上文obj
Function.prototype.myApply = function (context) {
  //判断是不是函数在调用这个方法
  if(typeof this !== 'function') throw new Error(`${this} is not a function`)
  //调用这个方法的函数可能有返回值
  let res = undefined;
  //this是个函数，即调用myApply的函数，将其赋给context的一个属性，改变函数内部this指向
  context.fn = this;
  //给context一个默认值，没有传参的话就指向window,在node环境下就是object
  context = context || window
  //获取除context之外的其他参数，可能有也可能没有
  //call传的是多个参，而不是一个数组
  let args = [...arguments].slice(1) //arguments的第一个是context
  if(args) {
    //this本身就是一个函数，通过es6语法将数组展开传入this函数
    //其实就是context在调用函数，这样调用函数的this自然指向调用它的对象，即context
    res = context.fn(...args)
  }else{
    //若没有其他参数，直接执行this函数即可
    context.fn()
  }
  //返回res
  return res
}
```
**bind的实现**
bind会返回一个函数，因此除了直接赋值给一个变量再执行或直接执行外，还可以用new操作符去实例返回的函数，因此先了解下
new做了什么？
```javascript
//new做了什么
function create(context, ...args){
  //声明一个空对象
  let obj = {}
  //将obj对象的__proto__指向构造函数的的原型
  Object.setPrototypeOf(obj, context.prototype)
  //改变构造函数this指向，指向obj
  let res = context.apply(obj, args)
  //若构造函数有返回值且其类型是个对象，则返回构造函数所返回的值，否则返回之前声明的对象
  return res instanceof Object ? res : obj
}
```
用new去实例化一个构造函数，其this会指向实例，优先级最高，即
```javascript
let value = 2
let obj = {value: 1}
function foo () {
  console.log(this.value)
}
let fn = foo.bind(obj)
let f = new fn()
```
以上会打印出undefined，因为foo中的this指向变量f，而变量f中没有value值。\
在bind的实现中，不只是改变函数this的指向然后包在一个函数里边就返回出来，
还要判断返回出去的函数是否用了new操作符。
```javascript
Function.prototype.mybind = function (context) {
  //保存一份this，this是个函数
  const _this = this
  //获取调用bind时的参数
  const args = [...arguments].slice(1)
  context = context || window
  if(typeof this !== 'function'){
    throw new Error("error")
  }
  const resFn = function () {
    //因为返回的的数可以再传参数，故需要和bind时所传的参数一起收集
    const argus = args.concat([...arguments])
    //此处判断其是否用了new操作符
    //如果用了new，些时this指向其构造函数，即_this
    //若直接执行，this则是window,则是普通的bind
    return _this.apply(this instanceof _this ? this : context, argus)
  }
  //继承构造函数，故将其返回函数的原型指向new出来的实例
  //这里借助一个空函数
  const emptyFn = function () {}
  emptyFn.prototype = this.prototype
  resFn.prototype = new emptyFn()
  return resFn
}
```
回到之前的问题，为什么多次绑定了bind会无效
```javascript
let obj1 = {value: 1}, obj2 = {value: 2}
function foo () {console.log(this.value)}
let fn = foo.mybind(obj1)
fn()  //1
let f = fn.mybind(obj2)
f()  //1     函数foo指向obj2无效
```
是不是mybind在用第二次就无效了呢？\
并不是，mybind在用第二次依然有效，它也的确改变了this的指向，但改变的仅仅是它之前整个函数的指向
```javascript
//(foo.mybind(obj1).mybind(obj2).mybind(obj3))()  拆解成以下代码
let first = foo.mybind(obj1)
let two = first.mybind(obj2)
let three = two.mybind(obj3)
three()
//执行结果依旧是foo执行的结果
//two的this指向obj3，但也仅仅是指向，并没有执行foo函数，而是执行了整个two
//同理，first的this指向obj2，执行first函数，
//一路往上执行到了first时，foo的this指向obj1，执行foo，才得到结果，此时this是指向obj1的
//也就是说first之后调用mybind的，并没有改变foo里this的指向，改变的是其之前整个函数的this的指向
```
