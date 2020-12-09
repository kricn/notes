## 使用调试工具
安装打包分析工具wepack-bundle-analyzer
```shell
# 安装
npm install webpack-bundle-analyzer --save-dev
# 在vue.config.js中配置，如果是webpack的配置，则在webpack.config.js中配置
modules.export = {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  ...    # 其他配置
  plugins: [
    new BunddleAnalyzerPlugin({
      # 配置分析报告显示模式，server就是启动服务显示报告，通过http访问
      # 对应的还有static和disable
      analyzerMode: 'server',
      # 服务器地址，一般是本地
      analyzerHost: '127.0.0.1',
      analyzerPort: 8888, # 默认8888
      # 报告文件名字，static模式下生效
      reportFilename: 'report.html',
      # 自动打开，默认true
      openAnalyzer: true 
    })
  ]
}
# 启动
npm run build --reoprt 或 npm run serve --report
```
通过分析工具可以可以看到打包后vendor大小，再对对应较大的模块作优化

## 处理相对较大的模块

## 使用cdn加载