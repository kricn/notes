## 使用调试工具
安装打包分析工具wepack-bundle-analyzer
```javascript
//安装
npm install webpack-bundle-analyzer --save-dev
//在vue.config.js中配置，如果是webpack的配置，则在webpack.config.js中配置
modules.export = {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  ...    //其他配置
  plugins: [
    new BunddleAnalyzerPlugin({
      //配置分析报告显示模式，server就是启动服务显示报告，通过http访问
      //对应的还有static和disable
      analyzerMode: 'server',
      //服务器地址，一般是本地
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888, //默认8888
      //报告文件名字，static模式下生效
      reportFilename: 'report.html',
      //自动打开，默认true
      openAnalyzer: true 
    })
  ]
}
# 启动
npm run build --reoprt 或 npm run serve --report
```
通过分析工具可以可以看到打包后vendor大小，再对对应较大的模块作优化

## 处理相对较大的模块
### 全局引入的模块
```shell
# 全局引入模块的话，会在打包时打包到app.js里，导致文件变大
# 分析模块使用情况的多少，尽量在具体页面引入
```
### 第三方ui框架
```shell
# 像element-ui, ant-design等第三方ui框架
# 可能并不会用到全部的组件，在Vue.use()可以不全局引用
# 像button, message全局提示，input等在多个地方会用到的可以全局引入
# 像只有一个页面或两个页面引用到的，就局部引入即可
```
### 第三方函数库
```shell
# moment, echart, lodash这些包都是很大的
# echart和lodash可以按需引入，moment不行
# 可以用date-fns替换moment库
# antd需要使用moment对象，可以将moment的一些语言包去掉
# 在webpack的plugins里，添加new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
```
### 使用cdn加载
```javascript
// 像一些基本不变的模块包，如vue-router, axios, vuex等
// 可以改用cnd加载，国内服务可以用bootcdn

//在pubilc文件夹下的index.html引入需要的第三方库
//引入之后，全局环境下就会存在变量 $ 和 Jquery
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

// 在 webpack.config.js 或 vue.config.js 中配置externals
module.exports = {
  ...,
  externals: {
    'jquery': 'Jquery',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios'
  }
  // externals属性中，左边的key可以自定义，右边有value是存在全局中的
  // externals属性会将value这个全局变量（右边那个）映射到key（左边那个)
  // 用vue时正常使用即可，即import VueRouter from 'vue-router'
}
```
### 服务器开启gzip

## 路由懒加载
```javascript
// import Home from '@/views/home.vue'  //导入，页面加载里就会引入
router = [
  {
    path: '/',
    component: () => import('@/views/home.vue'),  //懒加载
    // component: Home  //没有懒加载
  }
]
```
## 压缩图片文件
```javascript
// 在vue.config.js 中
module.exports = {
  chainWebpack: config => {
    config.module.rule('images')
      .test('/\.png|jpe?g|gif|svg(\?.*)?$/')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
  } 
}
```
## vue开启gzip压缩
```javascript
const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
      .use(new CompressionPlugin({
        test:/\.js$|\.html$|.\css/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      }))
    }
  }
}
```