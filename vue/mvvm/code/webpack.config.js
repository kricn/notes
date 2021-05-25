const path = require("path");
//抽离css模块
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin=require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, agrv) => {
	env = env || {};
	return {
		//入口
		entry: "./src/main.js",
		//模块配置
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
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, './public/index.html'),
				filename: 'index.html',
				title: 'webpack config title',
			}),
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin({
				filename: '/static/css/main.css'
			})
		],
		...env.development?require("./config/webpack.dev.config.js"):require("./config/webpack.prod.config.js")
	}
}
