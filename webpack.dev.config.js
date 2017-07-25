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
var config = {
  "index/index": "./source/v3/index.js",

};

module.exports = function(env) {
  process.noDeprecation = true;
  var files = env && env.file || null;
  if (files) {
    files = files.split(',');
    htmlName = files[0].split('/').reverse()[0].replace(/\.js/, '');

  }


  var getEntry = function() {
    var entry = {};
    var matchs = [];

    if (files && files.length) {

      for (var file of files) {

        entry[file.replace(/\.js/, '')] = "./source/" + file.replace(/\.js/, '') + '.js';

      }
      if (Object.keys(entry).length === files.length) {
        return entry;
      }
    } else {
      entry = {}
    }

    return entry;
  };
  return {
    plugins: [
      // commonsPlugin,
      // ignoreFiles,
      new webpack.ProvidePlugin({
        TD: ['vue/dist/vue.esm.js', 'default'],
        Vuex: ['vuex/dist/vuex.esm.js', 'default']
      }),
      new webpack.DllReferencePlugin({
        context: __dirname, // 同那个dll配置的路径保持一致
        manifest: require('./config/manifest.json') // manifest的缓存信息
      }),
      new HtmlWebpackPlugin({
        filename: './' + htmlName + '/' + htmlName + '.html', //path.resolve(__dirname, htmlName + '/' + htmlName + '.html'),
        template: 'source/assets/index.html',
        inject: false,
        hostname: "http://localhost:8080/"
      }),
      new ExtractTextPlugin("[name].css"),
      new webpack.LoaderOptionsPlugin({
        options: {

        }
      })
    ],
    entry: Object.assign( /*getEntry(), */ {
      // WebpackDevServer host and port

      'index/index': ['webpack-dev-server/client?http://127.0.0.1:8080', './source/index/index.js']
    }),
    output: {
      //path: path.resolve(__dirname, '../../webroot_misc/wap/dist/jiuwo/1.0.0/source/new'),
      //  publicPath: 'http://localhost:8080/',
      path: __dirname + '/dist/1.0.0', // path.resolve(__dirname, 'dist/1.0.0'),
      filename: '[name].js',
      publicPath: 'http://localhost:8080/1.0.0'
    },
    module: {
      rules: [{
        test: /\.json$/,
        use: [{
          loader: 'json-loader'
        }]
      }, {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015-loose'],
            plugins: ['transform-runtime']
          },
        }],
        exclude: [
          /node_modules/
        ],
      }, {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader'
        }],
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }, {
        test: /\.(png|jpg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[0].[ext]',
            regExp: '\/',
            useRelativePath: false,
            publicPath: '//localhost:3000/1.0.0/img/',
            limit: '8192'
          }
        }]
      }, {
        test: /\.scss$/,

        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', {
            loader: 'sass-loader'
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [
                  //require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          }]

        }),
      }]

    },
    devtool: "#inline-source-map",
    externals: {
      _: 'window._',
      $: 'window.jQuery',
      Vuex:'window.Vuex'
    },
    // babel: {
    //   presets: ['es2015-loose'],
    //   plugins: ['transform-runtime']
    // },
    // node: {
    //   fs: 'empty',
    //   tls: 'empty'
    // },
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm.js',
         // 'vuex': 'vuex/dist/vuex.esm.js'
      }
    }
  }
}