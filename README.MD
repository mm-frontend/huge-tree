## 手写我的 VUE-CLI
先 clone 一份 vue-cli 作为参考。
### 1. 初始化webpack
```
// webpack 4.x+
$ yarn add webpack webapck-cli -D
```
### 2. 添加项目结构
入口文件：src/main.js
html模版文件：index.html
webpack配置文件： webpack.config.js
### 3. webpack 基础配置
```$ yarn build```, 会生成dist/app.**.js, 在浏览器 Console 中运行试试。
```
const path = require('path')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[contenthash:8].js'
  }
}
```
### 4. 使用devServer, HtmlWebpackPlugin
$ yarn add webpack-dev-server -D
$ yarn add html-webpack-plugin -D
```
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, './index.html') })
  ],

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
```
### 5. 转译ES6、ES7 使用 babel-loader
// 注意 babel-loader@7 与 babel-core@6 配套使用；babel-loader@8 与 babel-core@7 配套使用。
$ yarn add babel-loader babel-core babel-preset-env babel-preset-stage-2 -D
$ yarn add babel-plugin-transform-runtime babel-runtime -D
添加 ```.babelrc``` 文件
```
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
  ]
}
```
### 6. 接入less、postcss
$ yarn add less less-loader css-loader style-loader -D
$ yarn add postcss-loader autoprefixer -D
添加```.postcssrc``` 文件。

### 6. 识别 .vue 文件
$ yarn add vue-loader vue-template-compiler -D
$ yarn add vue
```
resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
  },
```
