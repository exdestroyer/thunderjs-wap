const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const argv = require('yargs').argv;
const ignoreFiles = new webpack.IgnorePlugin(/video.js$/);
var files = argv.file;

module.exports = {
  entry: {
    'thunder': ['vue','vuex']
  },
  output: {
    //publicPath: 'http://localhost:8080/',
    path: path.resolve(__dirname, 'dist/1.0.0/lib'),
    filename: '[name].js',
    library: '[name]'               // 必填项，将此dll包暴露到window上
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,                // 必填项，用来标志manifest中的路径
      path: './config/manifest.json',    // 必填项，存放manifest的路径
      name: '[name]'                     // 必填项，manifest的name
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     drop_debugger: true,
    //     drop_console: true
    //   },
    //   output: {
    //     ascii_only: true,
    //     beautify: false
    //   }
    // })
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      'vuex': 'vuex/dist/vuex.esm.js'
    }
  }
};