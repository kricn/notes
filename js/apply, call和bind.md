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











