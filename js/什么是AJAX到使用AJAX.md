## 什么是AJAX
AJAX(Asynchronous JavaScript + XML), 异步JavaScript和XML，
基于AJAX所建立起来的模型（网页、app），可以更快的将增量更新输出给用户而不用重载页面，
提高程序对用户操作的相应速度，提高用户体验。
所以AJAX是一种能实现无需页面刷新但能发送http请求进而获取服务端数据的一种方法集合。\
**AJAX的核心是调用js的XMLHttpRequest去向服务器请求并解析数据的，但AJAX并不只是调用了XMLHttpRequest，还调用了javascript, css, xml, dom等相关技术，最终呈现给用户**
## AJAX核心——XMLHttpRequest
XMLHttpRequest在js里边是个构造函数，通过new实例化一个XMLHttpRequest对象。
客户端在需要时可以通过XMLHttpRequest与服务端交互信息。
```javascript
const xhr = new XMLHttpReaquest()
//准备发起一个ajax请求,传入请求方式和url[,指定同步或异步]
xhr.open('get', '/example', true)
//设置请求头
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
//发送请求
xhr.send()

//同步请求还是异步请求是开发人员指定的，并不是说ajax就是异步的
//只是常用封装好的ajax库默认不指写是异步请求

//处理请求
//XMLHttpRequest有个onreadystatechange函数，它能监听readyState的变化
//readyState能代表ajax请求的一个状态，随着ajax的不断进行，其值也在不断变化0：调用open之前，1：调用open，2：调用send，3：没未完全接收数据，4：接收完成
//数据返回客户端会xhr通过status取得服务器的状态码，通过respondText取得响应的数据
xhr.onreadystatechange => {
  if (xhr.readystate == 4 && xhr.status == 200) {
    console.log(xhr.responseText)
  }else{
    console.log("Data acquisition failed " + xhr.status)
  }
}
```
## 使用封装的AJAX库
1、使用jquery
jquery是对js方法的二次封装，是一个方法合集，其中就有封装好的ajax。
```javascript
//引入jquery
<script src="./jquery.min.js"></script>
<script>
  //调用封装好的ajax库
  $.ajax({
    url: '/examlpe',
    type: 'get',
    data: {
      name: 'kricn',
    },
    success: res => {
      console.log(res)
    },
    error: error => {
      console.log(error)
    }
  })
</script>
```
2、使用axios
Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中，它能在浏览器中创建 XMLHttpRequests。
```javascript
//引入axios
<script src='./axios.min.js'></script>
<script>
  axios({
    url: '/example',
    method: 'post',
    data: { name: 'kricn' }
  }).then(res => {
    console.log(res)
  }).catch(error => {
    console.log(error)
  })
</script>
```
## 写在最后
AJAX使得客户端在不刷新页面就能取得服务端的数据，大大提升了用户的体验。
同时AJAX接收开发都所需要的数据，而一不写是图片，或者html文档，
这使得数据的传输量更小更加轻量级，传输效率更高，更加节省带宽。
