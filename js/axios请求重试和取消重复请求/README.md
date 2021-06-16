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

📌以上是辅助函数，应用在请求拦截器和相应拦截器中。

```js
// code/web/utils/api.js
import axios from 'axios'
// ...上面的代码
// 创建 axios 实例，以后的请求都基于这个实例
const API = axios.create({
    baseURL: '/api', // 配置基础路径，这里配置这个是为了解决跨域
    tiemout: 15000
})
// 请求拦截
API.interceptors.request.use(config => {
  cancelPending(config); // 检查是否存在重复请求，若存在则取消已发的请求
  addPending(config); // 把当前请求信息添加到pending对象中
  return config
}, err => {
  cancelPending(error.config || {}); // 从pending对象中移除请求
  if (axios.isCancel(error)) {
    console.log("已取消的重复请求：" + error.message);
  }
  return Promise.reject(err)
})
// 响应拦截
API.interceptors.response.use(response => {
  cancelPending(response.config); // 从pending对象中移除请求
  return response;
}, err => {
  removePending(config)
  return Promise.reject(err)
})
export default API
```

**🙌启动 web 代码后，双击两次“连续请求”触发请求的取消**

## Axios 请求重试

一般的，请求重试需要的场景有：

🚩请求超时（也为 cancel)

🚩服务器异常（状态码为 5 开头）

```js
// 给实例 API 添加配置
API.defaults.retryTimes = 3;  // 重试次数
API.defaults.retryCount = 0;  // 已经重试了的次数
API.defaults.retryDelay  = 500; // 重试间隔
// ...其他代码
// 在响应拦截处配置
API.interceptors.response.use(response => {
  cancelPending(response.config); // 从pending对象中移除请求
  return response;
}, err => {
  let config = err.config
  // 此处要移除请求，而不是取消请求
  // 若取消请求，则下一次请求不再带有 config 对象，而是带 cancel 对象
  removePending(config)
  if (!config || !config.retryTimes) {
    return Promise.reject(err)
  }
  let { retryCount, retryDelay, retryTimes } = config

  if (retryCount > retryTimes) {
    return Promise.reject(err)
  }
  // 增加已经请求次数
  config.retryCount ++
  // 延时执行
  const delay = new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, retryDelay);
  })
  // 要用当前的实例 API 去再次发起请求
  return delay.then(() => API(config))
})
```

**🙌启动 web 代码后，点击两次“发起重复请求”触发请求重试**

### Axios 请求重试 —— 适配器（adapter）

## 参考文章

[Axios 如何实现请求重试](https://juejin.cn/post/6973812686584807432)

[Axios 如何取消重复请求](https://mp.weixin.qq.com/s/By-iXlONjSZLKFG2Xd7rpg)

