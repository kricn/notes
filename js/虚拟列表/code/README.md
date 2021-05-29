## 基本配置
1、空文件夹下执行 npm init -y 生成 package 文件

2、新建 webpack.config.js 文件作为 webpack 配置的入口

3、新建 config 文件夹单独配置生产环境(production)和开发环境(development)

4、安装 webpack 依赖

5、配置 packjson 中执行脚本
```sh
# 1
npm init -y
# 4
npm install webpack webpack-cli webpack-dev-server cross-env --save-dev
# 5
# packjson.js
# 在 script 中修改
"scripts": {
  "dev": "cross-env NODE_ENV=development webpack serve --config webpack.config.js",
  "build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```
6、新建 src 文件夹，在 src 下创建 main.js 作为 js 的入口文件
7、配置 webpack.config.js
```js
const path = require('path')
module.exports = {
  entry: './src/main.js', // 入口文件，所有文件的打包都从这个入口进来
  output: {
    path: path.resolve(__dirname, './dist'),, // 输出路径，生产环境下文件打包的路径
    filename: 'main.bundle.js'  // 输出文件名
  }
}
```
8、在 main.js 中写入代码
```js
// main.js
console.log('hello world')
```
9、运行 npm run build (这个命令在 packjson 配置，之后的命令会改成 yarn)
10、编译成功后，根目录下会生成一个 dist 文件夹，文件夹会有已经编译好的代码

## 配置 html 模板
1、新建 public 文件夹，在文件夹下新建 index.html 文件，初始化 html 文件，之后该 html 文件将作为主入口对 html 模板进行编译
2、安装 html-webpack-plugin
3、配置 webpack.config.js
```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
cosnt path = require('path)
module.exports = {
  // ...其它代码
  plugins: [  // 插件(plugins)配置在 plugins 中
    // 多个 html 模板就写多个
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),  // 模板文件位置
      filename: 'index.html',  // 输出名字
      title: 'webpack config title', // 动态标题，在模板 html 中可以用 <%= htmlWebpackPlugin.options.title %> 模板语法获取
    }),
  ]
}
```
## 配置 loader
loader 会帮助编译非 js 文件，loader 统一配置在 moduel.rules 中
1、安装对应 loader 
```sh
yarn add html-withimg-loader babel-loader @babel/core @babel/plugin-transform-runtime @babel/preset-env css-loader style-loader sass-loader sass postcss-loader file-loader --dev
# html-withimg-loader 帮助在 html 中直接插入图片(img标签)
# babel-loader @babel/core @babel/plugin-transform-runtime @babel/preset-env 配置 babel，将 es6 以上语法转成 es5
# style-loader css-loader postcss-loader 对 css 进行处理
# sass sass-loader 配置 scss 
# file-loader 处理其他静态文件
```
2、根目录下新建 .babelrc 和 postscss.config.js
3、安装 postcss 插件，这里以 precss 插件为例
```js
// webpack.config.js
module.exports = {
  // ...其他代码
  module: {
    rules: [
      {  // 配置 html-loader, 用于直接引入相对路径图片
					test: /\.html$/i,
					use: {
						loader: 'html-withimg-loader', // 会和 html-webpack-plugin 冲突导致 <%= htmlWebpackPlugin.options.title %> 无效
					}
				},
				{ 	// 配置 babel 
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',  // 会读取根目录下 .babelrc 文件
						options: {
							cacheDirectory: true,  // 缓存 babel 编译结果
						}
					}
				},
				{	// 配置 css-loader
					test: /\.css$/,
					use: ['style-loader', 'css-loader', 'postcss-loader']
				},
				{	// 配置 css 预处理语言
					test: /\.scss$/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,  // 1 表示在遇到 @import a.scss 文件时，会将此文件交给 postcss-loader 处理
												   // 2 表示会交给 postcss-loader 和 sass-loader 处理	
							}
						},
						'postcss-loader',
						'sass-loader'
					]
				},
				{
					test: /\.(png|jpe?g|gif)$/i,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'static/img/',
								limit: 5000,
								esModule:false
							}
						}
					]
				}
    ]
  }
}
// .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": [
      [
          "@babel/plugin-transform-runtime",
          {
              "absoluteRuntime": false,
              "corejs": 2,
              "helpers": true,
              "regenerator": true,
              "useESModules": false
          }
      ]
  ]
}
// postcss.config.js
module.exports = {
  plugins:[
      require('precss')
  ]
}
```
## 抽离 css
添加插件 mini-css-extract-plugin，将 module.rule 中的 style-loader 换成该插件
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  // ...其他代码
  module: {
    // ...其他 loader
    {	// 配置 css-loader
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
    },
  },
  plugins: [
    // 抽离 css 模块
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css'
    })
  ]
}
```

## 配置开发环境
```js
// config/webpack.dev.config.js
const path = require('path')
module.exports = {
	devServer: {
		contentBase: path.join(__dirname, 'dist'), // 本地服务以来文件夹
		port: 9000,  // 本地服务器端口
		host: '0.0.0.0',  // 可以通过本机 ip 访问
		proxy: { // 配置跨域
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				ws: true
			}
		}
	},
	mode: "development"
}
// config/webpack.config.prod.js
const path = require("path");

module.exports = {
	mode: "production",
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "static/js/[name].bundle.js"
	}
}
// 整合两个环境
// webpack.config.js
module.exports = (env, argv) => {
  return {
    // ...其他代码
    // 判断环境引入不同配置
    ...process.env.NODE_ENV === 'development'?require("./config/webpack.dev.config.js"):require("./config/webpack.prod.config.js")
  }
}
```
配置完后，端口变成 9000，同时区分开了生产环境和开发环境的配置

## 优化
### 使用分析工具
插件用法，新版的需要从包中结构出 BundleAnalyzerPlugin
```sh
yarn add webpack-bundle-analyzer --dev
```
### js, css压缩
```sh
yarn add terser-webpack-plugin optimize-css-assets-webpack-plugin --dev
```
在生产环境下加入
```js
// webpack.prod.config.js
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
module.exports = {
  // 其他代码
  optimization: { //优化项
		minimizer: [
			new TerserJSPlugin(),
			new OptimizeCss()
		]
	},
}
```
## 图片压缩
安装 image-webpack-loader，在 file-loader 后加上这个 loader
```js
// webpack.config.js
module.exports = {
  // ...
  module {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/img/',
              limit: 5000,
              esModule:false
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpeg 的配置
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // 使用 imagemin**-optipng 压缩 png，enable: false 为关闭
              optipng: {
                enabled: false,
              },
              // 使用 imagemin-pngquant 压缩 png
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              // 压缩 gif 的配置
              gifsicle: {
                interlaced: false,
              },
              // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
              webp: {
                quality: 75
              }
            }
          }
        ]
      }
    ]
  }
}
```
### 分割代码
```js
// webpack.config.js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      minSize: 3000, // 最小打包字节
      cacheGroups: {
        default: {
          name: 'common',  // 打包后的名称
          chunks: 'all' // 表示全部引用的都分开打包
        }
      }
    }
  }
}
```