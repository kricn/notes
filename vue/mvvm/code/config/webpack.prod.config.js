const path = require("path");
//css压缩
// const OptimizeCss = require("optimize-css-assets-webpack-plugin");
// const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
	// optimization: { //优化项
	// 	minimizer: [
	// 		new TerserJSPlugin(),
	// 		new OptimizeCss()
	// 	]
	// },
	mode: "production",
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "static/js/[name].bundle.js"
	}
}