var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config.js');
new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	//hot: true,
	historyApiFallback: true,
	contentBase: "./",
	//inline: true,
	proxy: {
		'/index/': {
			target: 'http://127.0.0.1:8080/dist/1.0.0/',
			secure: false
		}
	}
}).listen(8080, '127.0.0.1', function(err, result) {
	if (err) {
		console.log(err);
	}
	console.log('Listening at localhost:8080');
});