## 事件和事件流
事件js和html交互的一个动作，比如html中的按钮被点击，则发生了点击事件。
事件可以通过侦听器监听事件的发生。而事件流则是多个元素响应同一事件时所其事件的相应顺序，比如冒泡事件，
则是从触发的元素开始响应，之后事件一直向其父元素传递，一直到document。事件流在各大浏览器之间其执行
顺序也有所不同。
### 冒泡事件
```html
<html>
  <head></head>
  <body>
    <div>
      <button> click </button>
    </div>
  </body>
</html>
```
点击button时，事件发生顺序button -> div -> body -> html -> document，这种从最特定的目标(button)
到最不特定的目标(document)的发生顺序称为冒泡事件,ie的事件流就是冒泡事件
### 捕获事件
同上一个例子，点击button时，事件发生顺序是document -> html -> body -> div -> button,这种从最不特定
的目标(document)到最特定目标(button)的发生顺序成为捕获事件，与冒泡事件相反
### DOM事件流
DOM事件流是W3C制定的一个标准规范，它支持冒泡事件和捕获事件，同样触发之前的例子时，先发生捕获事件，再发生冒泡事件。
## 事件的绑定
### 通过DOM元素直接绑定
```javascript
<button id="btn" onclick="handleClick"></button>
```
### 通过js代码进行绑定
```javascript
<script>
  function handleClick() {}
  const btn = document.getElementById("btn")
  btn.onclick = handleClick;
  //删除事件
  btn.onclick = null
</script>
```
### 通过侦听器绑定
```javascript
<script>
  function handleClick () { console.log("hello world") }
  const btn = document.getElementById("btn")
  //addEventListener接受三个参数：监听事件的名字，处理函数，boolean
  //boolean为true，则为捕获事件，false为冒泡事件，默认为false
  btn.addEventListener("click", handleClick, false)
  //移除事件
  btn.removeEventListener("click", handleClick, false)
</script>
```
IE在事件监听这有所不同，通过attachEvent和detachEvent监听事件。这两个函数接受两个参数：
监听事件的名字和处理函数，ie中只支持冒泡。但通过attachEvent处理的事件，其会在全局作用域中运行，
即其中的this会指向window。
```javascript
//ie8及以下版本
function handleCilck () { console.log("hello world") }
const btn = document.getElement("btn")
//事件名要加上'on'前缀
btn.attachEvent("onclick", handleClick)
//删除事件
btn.detachEvent("onclick", handleClick)
```
### 封装一个兼容现代浏览器和ie浏览器的监听函数
```javascript
function addEvent (target, event, handle) {
  try {
    //主流浏览器和ie9及以上
    target.addEventListener(event, handle, false)
  } catch (e) {
    //ie8及以下
    try {
      target.attachEvent(event, handle)
    } catch (e) {
      //现代浏览器
      //其实相当于btn.onlick这样
      target['on' + event] = handle
    }
  }
}
```
### 冒泡事件的支持
不支持冒泡：onload,unload,focus,blur,submit,change
支持冒泡：keydownkeypress,keyup,click,dbclick,mousedown,mouseout,mouseover,mouseup,mousemove
键盘鼠标事件支持冒泡
## 事件委托
事件委托也叫事件代理，其基于冒泡事件，子元素触发事件，父元素也会触发，这样我们就可以将所有子元素触发的事件
委托在父元素上，实现只绑定一个事件便能响应多个事件。
**假如我们需要对所有指定ul下的li绑定点击事件**
```javascript
<body>
  <ul id="ul"></ul>
  <script type="text/javascript">
    window.onload = function () {
      function handleClick(value) {
        console.log(value)
      }
      let ul = document.getElementById("ul")
      for(let i = 0; i < 100; i++){
        let li = document.createElement("li")
        li.innerHTML = i
        li.style.width = '50px'
        li.style.height = '50px'
        li.style.border = '1px solid #000'
        li.onclick = function (){handleClick(this.innerHTML)}
        ul.appendChild(li)
      }
    }
  </script>
</body>
```
在动态添加li或者li数量大的情况下，每次遍历dom元素为其绑定事件会大大消耗内存，
因此利用冒泡事件，将li的所有点击事件委托在其父级ul上，降低事件的绑定次数。
```javascript
<body>
  <ul id="ul"></ul>
  <script type="text/javascript">
    window.onload = function () {
      function handleClick(value) {
        console.log(value)
      }
      let ul = document.getElementById("ul");
      ul.onclick = function (event) {
        //IE中并不会传入事件，所以需要window上的事件，不然会没有target
        //若没下面那句，event为undefined
        event = event || winow.enevt
        //源对象，即上文所说的最特定对象，ie中通过srcElement获取
        //target的本质和通过后document.getElementById或getElementsByTagName拿到的对象本质一样
        //可以拿到其上的id,style,class...等
        const target = event.target || event.srcElement
        handleClick(target.innerHTML)
        //若针对不同id的li或ul下其他元素做不同的事，可以用到switch(target.id)或其它标志
        //即使没有这个元素也可以监听，或可能会出添加进来的元素也可以监听
        switch(target.id): 
          case "save_li":
            save()
            break;
          case "cancle_li":
            calcel()
            break;
          default:
            doit()
      }
      for(let i = 0; i < 100; i++){
        let li = document.createElement("li");
        li.innerHTML = i
        li.style.width = '50px'
        li.style.height = '50px'
        li.style.border = '1px solid #000'
        //不在此处绑定
        // li.onclick = function (){handleClick(this.innerHTML)}
        ul.appendChild(li)
      }
    }
  </script>
</body>
```
**事件委托优缺点**\
优点：相比事件绑定，事件委托其内存消耗更低，处理速度更快。
缺点：事件委托执行需要耗时，并不是直接委托给document就一劳永逸的，委托给越顶层，
其事件传播时间也就越长。
## 阻止事件冒泡和阻止事件默认行为
**阻止事件冒泡**\
并不是所有事件默认冒泡或捕获不会产生其它影响，比如子元素绑定了点击事件，父元素也有点击事件，
两个事件要执行的函数不一样，那么默认的话，我点击子元素，执行子元素触发的函数，但父元素也
响应了点击事件，也执行了相应的函数，这并不是我们想要的，于是需要阻止事件冒泡。
```javascript
//1、直接在需要阻止冒泡元素对应函数最后加上return false即可
//冒泡事件促发调用这个函数后会停止冒泡
//function handleClick () { console.log("hello world"); return false; }
//2、通过事件event.stopPropagation, ie下为window.event.cancelBubble
function stopBubble (e) {
  //有事件对象传入，则说明是非ie浏览器
  if (e && e.stopPropagation ) {
    e.stopPropagation ()
  } else {
    window.event.cancelBubble = true; // ie浏览器
  }
}
```
**阻止事件默认行为**\
阻止默认行为一般场景表单提交按钮，阻止了默认行为后，连接不再跳转。
```javascript
<div id = "div">
  <a id="web" href="https://github.com/kricn">kricn</a>
</div>
<script>
const div = document.getElementById("div")
const web = docuemnt.getElementById("web")
div.onclick = function () { console.log("this is div element") }
//点击页面不会发生跳转，但会发生冒泡，也会打印出end
web.onclick = fucntion (e) {
  if (e && e.preventDefault ){
    e.preventDefault();		//阻止默认浏览器动作		        
  }else{
    window.event.returnValue = false;	//IE中阻止函数器默认动作的方式
  }
  console.log("end")
}
</script>
```
