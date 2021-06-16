const path = require("path");
//抽离css模块
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin=require("html-webpack-plugin");
// 合并 webpack 配置 mini-css-extract-plugin 使用
const { merge } = require('webpack-merge');
module.exports = (env, agrv) => {
	env = env || {};
	
	return merge(
		process.env.NODE_ENV === 'development'?require("./config/webpack.dev.config.js"):require("./config/webpack.prod.config.js"),
    {
		//入口
		entry: "./src/main.js",
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 3000,
      }
    },
		//模块配置
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
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
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
								outputPath: 'static/img/',
								limit: 5000,
								esModule:false
							}
						},
            // {
            //   loader: 'image-webpack-loader',
            //   options: {
            //     disable: process.env.NODE_ENV === 'production' ? false : true,
            //     // 压缩 jpeg 的配置
            //     mozjpeg: {
            //       progressive: true,
            //       quality: 65
            //     },
            //     // 使用 imagemin**-optipng 压缩 png，enable: false 为关闭
            //     optipng: {
            //       enabled: false,
            //     },
            //     // 使用 imagemin-pngquant 压缩 png
            //     pngquant: {
            //       quality: [0.65, 0.9],
            //       speed: 4
            //     },
            //     // 压缩 gif 的配置
            //     gifsicle: {
            //       interlaced: false,
            //     },
            //     // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
            //     webp: {
            //       quality: 75
            //     }
            //   }
            // }
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
			new MiniCssExtractPlugin({
				filename: 'static/css/main.css'
			})
		],
	})
}

