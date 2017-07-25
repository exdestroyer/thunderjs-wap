const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const srcDir = path.resolve(process.cwd(), 'source');
const fs = require('fs');
const glob = require('glob');
const argv = require('yargs').argv;
const ignoreFiles = new webpack.IgnorePlugin(/video.js$/);
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
var files = argv.file;
var htmlName = 'index';
if (files) {
  files = files.split(',');
  htmlName = files[0].split('/').reverse()[0].replace(/\.js/, '');

}

var config = {
  //  "index/index": "./source/index/index.js",
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

      require('autoprefixer'),
      new webpack.DefinePlugin({
        DESCRIPTION: 'This Is The Test Text.'
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          customInterpolateName: (url, name, options) => {
              console.log(url,name)
            return url.replace('[myAssetPath]', '/some/path/');
          },
        },
      }),
      new webpack.ProvidePlugin({
        TD: 'vue',
        Vuex: ['vuex/dist/vuex.esm.js', 'default']
      }),
      new webpack.DllReferencePlugin({
        context: __dirname, // 同那个dll配置的路径保持一致
        manifest: require('./config/manifest.json') // manifest的缓存信息
      }),
      new HtmlWebpackPlugin({
        title: 'ThunderJS示例',
        template: 'source/assets/index.html',
        filename: path.resolve(__dirname, 'dist/' + htmlName + '/' + htmlName + '.html'),
        inject: false,
        hostname: "http://localhost:3000/"
      }),
      new ExtractTextPlugin("./css/[name].css"),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        //  drop_debugger: true,
         // drop_console: true
        },
        output: {
          ascii_only: true,
          beautify: false
        }
      }),
      new WebpackMd5Hash()
    ],
    entry: Object.assign(getEntry(), {
      //'vue.pack': ['vue', 'vue-resource']
    }),
    output: {
      publicPath: 'http://localhost:3000/1.0.0',
      path: path.resolve(__dirname, 'dist/1.0.0'),
      filename: 'js/[name].js'
    },
    module: {
      rules: [{
        test: /\.js$/,
        enforce: "pre",
        use: [{
          loader: "unicode-loader"
        }]
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
        test: /\.json$/,
        use: [{
          loader: 'json-loader'
        }]
      }, {
        test: /\.js$/,

        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["es2015"],
            plugins: ['transform-runtime']
          }
        }],
        exclude: /node_modules/
      }, {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader'
        }],
      }, {
        test: /\.scss$/,

        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', {loader:'sass-loader'},{
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
      }],
    },
    externals: {
      $: 'window.jQuery',
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
}