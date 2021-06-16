const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 分析插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//css压缩
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
	optimization: { //优化项
		minimizer: [
			new TerserJSPlugin(),
			new OptimizeCss()
		]
	},
	mode: "production",
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "static/js/[name].bundle.js"
	},
	plugins: [
		new CleanWebpackPlugin(),
		// 打包分析
		// new BundleAnalyzerPlugin({
		// 	analyzerPort: 8889, // 指定端口号
		// 	openAnalyzer: true,
		// }),
	]
}