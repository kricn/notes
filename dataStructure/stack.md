## 栈
**栈是一种先入后出(LIFO)的数据结构**\
可以看成是一个罐子，罐子下面（先放进去）的东西，要等上面（后进来）的拿出来后，才能取到，
我们浏览网页时，前进后退按钮只能前进或者后退你上一次的浏览记录，想要退到最开始（最先入栈）
的那一条，要一条条的往回退
## 使用数组模拟栈
```javascript
class Stack {
  constructor () {
    this.stack = []
    this.len = 0
  }
  //入栈
  push = val => {
    this.stack.push(val)
    this.len += 1
  }
  //出栈
  pop = () => {
    if (this.len === 0) {
      return undefined
    }
    this.len -= 1
    return this.stack.pop()
  }
  //查看顶部元素
  peek = () => {
    return this.stack[this.len -1]
  }
  //查看栈长度
  length = () => {
    return this.len
  }
  //清空栈
  clear = () => {
    this.stack = []
    this.len = 0
  }
}
```
## 举个例子:memo:
**:bookmark:判断字符串是不是回文**\
回文就是正着读和反着读都一样的字符段，比如level，10001等\
可以通过将字符串全部入栈，然后全部出栈对比判断
```javascript
const isPalindrome = str => {
  str = JSON.stringify(str)
  if (str.length === 1) {
    return true
  }
  let stack = new Stack()
  for (let i = 0; i < str.length; i++) {
    stack.push(str[i])
  }
  let s = ''
  while(stack.length()) {
    s += stack.pop()
  }

  return str === s
}
console.log(isPalindrome("level"))  //true
console.log(isPalindrome(1001))    //true
console.log(isPalindrome("kricn"))    //false
```













