## Axios 取消重复请求

Axios 通过调用 CancelToken 函数实例化 CancelToken 去取消请求

```js
import axios from 'axios'
const CancelToken  = axios.CancelToken;
let cancel;  // 取消请求变量
axios.get('/app', function () {
    cancelToken: new CancelToken(c => {
        cancel = c  // 将当前取消请求的方法传递给外部
    })
})
cancel()  // 取消请求
```

在 Axios 的拦截器中判断请求是否是同一个请求来决定是否去取消原来的请求或其他操作。

一般的，把请求路径，请求方法和请求参数（包括 get 的 query(params) 和 post 的 body(data)）一样的请求归为重复请求，并用 Map 去保存该请求。

```js
import qs from 'qs'  // 通过 qs 库去合并请求
// 保留请求
let pending = new Map()
// 生成请求标志
// config 是请求的一些配置，包括 method, params, data, url
function generateKey(config) {
    const { method, params, data, url } = config
    return [ method, url, qs.stringify(params), qs.stringify(data) ].join('&')
}
// 添加请求
function addPending(config) {
    const requestKey = generateKey(config);
    // 设置 cancelToken 并保存在 pending 中
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        if (!pending.has(requestKey)) {
            pending.set(requestKey, cancel);
        }
    });
}
// 移除请求（但不取消请求）
function removePending(config) {
    const requestKey = generateKey(config);
    if (pending.has(requestKey)) {
        pending.delete(requestKey)
    }
}
// 取消请求
function cancelPending(config) {
  const requestKey = generateReqKey(config);
  if (pending.has(requestKey)) {
     const cancelToken = pending.get(requestKey);
     // 取消请求伴随移除请求
     cancelToken(requestKey);
     pending.delete(requestKey);
  }
}
```

以为是辅助函数，应用在请求拦截器和相应拦截器中。

```js
import axios from 'axios'
// ...上面的代码
// 创建 axios 实例，以后的请求都基于这个实例

```



## 参考文章
[Axios 如何实现请求重试](https://juejin.cn/post/6973812686584807432)

[Axios 如何取消重复请求](https://mp.weixin.qq.com/s/By-iXlONjSZLKFG2Xd7rpg)

