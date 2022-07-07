const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const webpack = require('webpack')

// 压缩打包生成文件
// const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: "production", //development|production
  output: {
    filename: '[name].[hash:7].js'
  },
  plugins: [
    // new UglifyjsWebpackPlugin() 和 webpack 核心插件 (webpack.optimize.UglifyJSPlugin) 是同一个插件
    // 但是目前 npm7.x 的版本比 npm6.x 更严格，所以直接安装会报错
    // webpack.optimize.UglifyJsPlugin 已被移除，压缩代码不能用这个插件
    // 直接 webpack --mode production 打包出来就被压缩，空行和注释消失
    // new webpack.optimize.UglifyJsPlugin(),

    // 针对多入口文件共同引入的模块进行分离打包，即打包一个新文件来存储共同引入的模块免得重复打包
    new webpack.optimize.SplitChunksPlugin(),
  ],
  optimization: {
    // webpack.optimize.SplitChunksPlugin 插件的配置项
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        }
      }
    }
  }
})