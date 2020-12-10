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
// 
```