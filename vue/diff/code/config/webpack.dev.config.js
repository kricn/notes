const path = require('path')
module.exports = {
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8000,
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