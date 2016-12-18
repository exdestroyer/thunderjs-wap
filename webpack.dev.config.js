const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
  //const commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vue.pack', 'lib/vue.pack.js');
const path = require('path');
const srcDir = path.resolve(process.cwd(), 'source');
const fs = require('fs');
const glob = require('glob');
const argv = require('yargs').argv;
const ignoreFiles = new webpack.IgnorePlugin(/video.js$/);
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var files = argv.file;
var htmlName = 'index';
if (files) {
  files = files.split(',');
  htmlName = files[0].split('/').reverse()[0].replace(/\.js/, '');

}


var getEntry = function() {
  var entry = {};
  var matchs = [];

  for (var name of glob.sync(srcDir + '/!(lib|common|assets|components|vuex)**/*.js')) {
    if (files && 　files.length) {

      for (var file of files) {
        var reg = new RegExp(".*\/(\\w+\/" + file.replace(/\.js/, '') + ")\.js$");

        matchs = name.match(reg);

        if (matchs) {
          //  console.log(matchs[1].match(/\w+\/\w+$/))
          //  console.log(matchs[1].replace(/^\w+\/(\\w+\/\\w+)$/,"$1"))
          entry[matchs[1].match(/\w+\/\w+$/)[0]] = name;
        }
      }
      // console.log(Object.keys(entry).length === files.length)
      if (Object.keys(entry).length === files.length) {
        return entry;
      }
    } else {

      matchs = name.match(/\/(\w+\/\w+)\.js$/);
      if (matchs) {

        entry[matchs[1]] = name;
      }
    }
  }
  return entry;
};

module.exports = {
  plugins: [
    // commonsPlugin,
    // ignoreFiles,
    new webpack.ProvidePlugin({
      TD: 'vue',
      Vuex: 'vuex'
    }),
    new webpack.DllReferencePlugin({
      context: __dirname, // 同那个dll配置的路径保持一致
      manifest: require('./config/manifest.json') // manifest的缓存信息
    }),
    new HtmlWebpackPlugin({
      filename: './' + htmlName + '/'+ htmlName +'.html', //path.resolve(__dirname, htmlName + '/' + htmlName + '.html'),
      template: 'source/assets/index.html',
      inject: false,
      hostname:"http://localhost:8080/"
    }),
    new ExtractTextPlugin("[name].css"),
  ],
  entry: Object.assign(/*getEntry(), */{ 
     // WebpackDevServer host and port
    
    'index/index': ['webpack-dev-server/client?http://127.0.0.1:8080','./source/index/index.js']
  }),
  output: {
    //path: path.resolve(__dirname, '../../webroot_misc/wap/dist/jiuwo/1.0.0/source/new'),
  //  publicPath: 'http://localhost:8080/',
    path: __dirname + '/dist/1.0.0', // path.resolve(__dirname, 'dist/1.0.0'),
    filename: '[name].js',
    publicPath: 'http://localhost:8080/dist/1.0.0'
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("css-loader")
    }, ]

  },
  devtool: "#inline-source-map",
  externals: {
    '_': 'window._',
    '$': 'window.jQuery',
  },
  babel: {
    presets: ['es2015-loose'],
    plugins: ['transform-runtime']
  },
  node: {
    fs: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      'vue': '../lib/vue.common.js'
    }
  }
}