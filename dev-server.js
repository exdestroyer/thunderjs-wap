const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('./webpack.dev.config.js')();
const proConfig = require('./webpack.config.js');
let config = process.env.NODE_ENV == 'production' ? proConfig : devConfig;
new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	//hot: true,
	historyApiFallback: true,
	contentBase: "./dist",
	//inline: true,
	proxy: {
		'/index/': {
			target: 'http://127.0.0.1:8080/1.0.0/',
			secure: false
		}
	}
}).listen(8080, '127.0.0.1', function(err, result) {
	if (err) {
		console.log(err);
	}
	console.log('Listening at localhost:8080');
});