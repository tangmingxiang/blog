const { merge } = require('webpack-merge');
const path = require('path')
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    /* static 指定由什么路径来提供静态资源 */
    /* 注意与 HtmlWebpackPlugin 插件配置不同的是，这里的相对路径是相对配置文件本身来说的，而不是相对执行 webpack 命令时的路径 */
    /* 文档中通过 contentBase 属性来配置静态资源路径，可能存在过时问题，且在 HtmlWebpackPlugin 插件存在时，会报错 */
    static: path.join(__dirname,'../'),
    host: 'localhost',
    port: 8080,
    open: true,
  },
});