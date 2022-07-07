const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// BundleAnalyzerPlugin 查看打包模块依赖关系以及size 插件，打包完成之后自动在浏览器显示依赖关系图等信息
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  //指定入口
  entry: {
    main: './app/main.js',
    // http: './app/http.js'
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      title: "Blog",
      template: './index.html', // 指定原文件的路径
    }),
    new CleanWebpackPlugin()
  ],
  output: {
    //输出文件名称
    filename: '[name].build.js',
    //输出文件路径
    path: path.resolve(__dirname, '../dist')
  },
  // externals: {
  //   wangeditor: 'wangEditor'
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },
      {
        test: /\.styl$/i,
        use: [ "style-loader", "css-loader", "stylus-loader" ],
      }
    ]
  }
};