const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	entry: './src/main.js',
	// entry: {  // 多入口，其中的 key 值对应 output 里的 [name]
	// 	main: './src/main.js',
	// 	print: './src/mutipleEntry/print.js'
	// },
	// entry: {
	// 	// 数组语法，合并多个文件
	// 	main: ['./src/main.js', './src/mutipleEntry/print.js']
	// },
	output: {
		filename: 'static/js/[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},

	// 配置 loader
	module: {
		rules: [
			{  // 配置 html-loader, 用于直接引入相对路径图片
				test: /\.html$/i,
				use: {
					loader: 'html-withimg-loader',
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
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{	// 配置 css 预处理语言
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
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
							outputPath: '/static/img/',
							limit: 5000,
							esModule:false
						}
					}
				]
			}
		]
	},
	plugins: [  // 配置插件
		//  多入口项目就多配置几个插件
		new HtmlWebpackPlugin({  // 配置 html 插件，用于生成 html 文件
			template: './src/index.html',
			filename: 'index.html',
			title: 'webpack config title',
		}),
		new CleanWebpackPlugin(),  // 用于下一次打包时清除 output 文件夹
		new MiniCssExtractPlugin({
			filename: '/static/css/[name].css'
		}),  // 压缩 css
	]
}