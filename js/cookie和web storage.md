## cookie
由于http协议是无状态协议，服务器不会记录关于客户端的任何信息。
那么服务端要如何识别客户端状态呢（有没有请求过）？\
基于此背景，cookie便诞生了。\
cookie是存在浏览器里的一小段文本，它会随http请求一起发送给服务端，服务端在接收到请求后，
会检查cookie，获取客户端的状态。可以在chrom浏览器下f12面板的application查看到。\
**设置cookie**\
cookie会随http请求一起发送，可以通过Set-Cookie指写cookie。
```javascript
//设置cookie
/*
  @name: cookie对应的键
  @value: cookie对应的值
  @option: cookie其它属性,是个对象
  可以传：
    @expiers: cookie过期时间
    @path: cookie的路径， 当前页面即为/
    @domain: cookie的域名， 默认为当前域名
    @secure: cookie的安全性，true为只有htts请求才会被发送
*/
function setCookie (name, value, option) {
  let cookieContent = name + value
  if(Object.keys(option).length === 0) { return cookieContent }
  for( ley key in option ) {
    cookieContent += `; ${key}=${option.key}`
  }
  //通过document.cookie设置
  document.cookie = cookieContent
}

//获取cookie
function getCookie (name) {
  let cookie = document.cookie;
  let cookieArr = cookie.split(/; /g)
  if(cookieArr.length === 0) return null;
  let resObj = {}
  cookieArr.forEach(arr => {
    let temp = arr.split(/=/g)
    resObj[temp[0]] = temp[1]
  })
  return resObj.name
} 

//删除cookie
function deleteCookie (name) {
  document.cookie = name + "= ; expires=" + new Date(0)
}
```
**cookie的优缺点**\
优点：\
  1、cookie的传输经过ssl加密，减少被破解的可能性\
  2、可以控制其生命周期\
缺点：\
  1、cookie的存储量不大，最多仅4kb，超过便会被截断\
  2、每个domain存放的cookie有限，最多20条\
  3、若cookie被拦截，拦截者只要原样转发cookie便可以达到目的，不用破解依然有效\
  4、无论在同一域名发出什么样的请求都会携带上cookie，即使这个请求并不需要cookie\
## Web Storage
Web Storage是html5为浏览器提供的数据存储机制。它分为localStorage和sessionStorage。
其相比于cookie，储存量大(5-10M)，且存于客户端，不与服务端发生通信。可以在chrom浏览器下f12面板的application查看到。\
**区别**
1、localStorage是持久化本地存储，写入之后除了手动删除外会一直存在。sessionStorage是临时的本地存储，
在当前会话（页面）中有效，会话结束，sessionStorage也就失效。\
2、localStorage和sessionStorage遵循同源策略，但sessionStorage即使是访问同一个域名下的相同页面，
浏览器窗口不同，sessionStorage便无法共享。\
**操作Web Storage**
```javascript
//通过setItem设置storage
localStorage.setItem("name", "kricn")
sessionStorage.setItem("name", "kricn")
//通过getItem获取storage
localStorage.setItem("name")
sessionStorage.setItem("name")
//通过removeItem删除对应storage
localStorage.removeItem("name")
sessionStorage.removeItem("name")
//清空storage
localStorage.clear()
sessionStorage.clear()
```
**Web Storage应用场景**\
localStorage持久化储存，用来存储一些不常更新的base64编码的图片，css文件和js文件等，
而sessionStorage在用于存储当前会话的一些不敏感信息，如本次会话的相关操作记录等。
## cookie和web storage对比
1、cookie会随http请求一起发送过去，不论服务端是否需要cookie，这就会产生额外的带宽，也不可跨域调用。
而web storage仅仅是在本地储存，不需要与服务器发生交互。\
2、cookie需要自己去封装cookie的设置和获取，删除等方法，而web storage就有封装好的setItem和getItem。
