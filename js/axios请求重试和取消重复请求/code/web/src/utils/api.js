import axios from 'axios'
import qs from 'qs'

const pending = new Map()

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
  // adapter: retryAdapterEnhancer(axios.defaults.adapter, {
  //   retryDelay: 1000
  // })
})

// axios 配置
API.defaults.retryTimes = 3;  // 重试次数
API.defaults.retryCount = 0;  // 已经重试了的次数
API.defaults.retryDelay  = 500; // 重试间隔

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

function retryAdapterEnhancer(adapter, options) {
  const { times = 0, delay = 300 } = options;

  return async (config) => {
    const { retryTimes = times, retryDelay = delay } = config;
    let __retryCount = 0;
    const request = async () => {
      try {
        return await adapter(config);
      } catch (err) {
        // 判断是否进行重试
        if (!retryTimes || __retryCount >= retryTimes) {
          return Promise.reject(err);
        }
        __retryCount++; // 增加重试次数
        // 延时处理
        const delay = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, retryDelay);
         });
         // 重新发起请求
         return delay.then(() => {
           return request();
         });
        }
      };
   return request();
  };
}

function generateKey(config) {
  const { method, url, params, data } = config;
  return [method, url, qs.stringify(params), qs.stringify(data)].join("&");
}

function addPending(config) {
  const requestKey = generateKey(config);
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pending.has(requestKey)) {
       pending.set(requestKey, cancel);
    }
  });
}

function removePending(config) {
  const requestKey = generateKey(config);
  if (pending.has(requestKey)) {
    pending.delete(requestKey)
  }
}

function cancelPending(config) {
  const requestKey = generateKey(config);
  if (pending.has(requestKey)) {
     const cancelToken = pending.get(requestKey);
     cancelToken(requestKey);
     pending.delete(requestKey);
  }
}

export default API