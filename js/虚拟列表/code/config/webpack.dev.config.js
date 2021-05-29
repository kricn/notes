const path = require('path')
module.exports = {
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 9000,
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				ws: true
			}
		}
	},
	mode: "development"
}