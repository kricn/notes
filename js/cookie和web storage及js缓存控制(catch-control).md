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
**cookie的优缺点**
优点：
  1、cookie的传输经过ssl加密，减少被破解的可能性
  2、可以控制其生命周期
缺点
  1、cookie的存储量不大，最多仅4kb，超过便会被截断
  2、每个domain存放的cookie有限，最多20条
  3、若cookie被拦截，拦截者只要原样转发cookie便可以达到目的，不用破解依然有效
  4、无论在同一域名发出什么样的请求都会携带上cookie，即使这个请求并不需要cookie
## Web Storage
Web Storage是html5为浏览器提供的数据存储机制。它分为localStorage和sessionStorage。
**区别**
1、localStorage是持久化本地存储，写入之后除了手动删除外会一直存在。sessionStorage是临时的本地存储，
在当前会话（页面）中有效，会话结束，sessionStorage也就失效。
2、








