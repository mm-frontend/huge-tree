const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {

  entry: {
    app: './src/main.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(css|less)$/,
        use: [
          // MiniCssExtractPlugin.loader,
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            // options: {
            //   modules: false,
            //   minimize: true,
            //   sourceMap: true,
            //   localIdentName: '[hash:base64:8]',
            // },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'less-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'vue-loader',
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, './index.html') }),
    new VueLoaderPlugin()
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
  },

  devServer: {
    // https: true,
    open: true,
    host: '0.0.0.0',
    port: 8000,
    disableHostCheck: true,
    hot: true,
    proxy: {//配置跨域，访问的域名会被代理到本地的3000端口
      '/api': 'http://localhost:3000'
    }
  }
}