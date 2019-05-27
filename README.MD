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

### 7. 识别 .vue 文件
$ yarn add vue-loader vue-template-compiler -D
$ yarn add vue
```
resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
  },
```
### 8. 对文件使用 url-loader(基于file-loader + limit功能)
$ yarn add url-loader -D
```
{
  test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'assets/images/[hash:8].[ext]',
      }
    }
  ]
},
{
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        name: 'assets/fonts/[hash:8].[ext]',
      }
    }
  ]
},
```
### 9. 接入 vue-router
$ yarn add vue-router
```
// 添加别名
resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    },
  },

// 按需加载， 注意.babelrc中： "comments": false,会使 /* webpackChunkName: 'helloWorld' */ 失效
const HelloWorld = () => import(/* webpackChunkName: 'helloWorld' */ '@/components/HelloWorld');
```
### 10. 使用 clean-webpack-plugin
```
const CleanWebpackPlugin = require('clean-webpack-plugin');
plugins: [
  new CleanWebpackPlugin(), // 多版本共存模式时 必须要取消这个插件
]
```

## 优化
### 1. 区分环境
$ yarn add cross-env -D
```
// package.json
scripts: {
  "build": "cross-env NODE_ENV=production webpack",
}

// 使用
porcess.env.NODE_ENV
```
### 2. 使用mode
```
const mode = process.env.NODE_ENV || 'development'

module.exports = {
  mode: mode,
}
```
### 3. 版本控制
开发环境的 --hot 不能使用contenthash、chunkhash
```
const chunkhash = isDev ? '[name].[hash:8].js' : '[name].[chunkhash:8].js'
const contenthash = isDev ? '[name].[hash:8].css' : '[name].[contenthash:8].css'

output: {
  path: path.resolve(__dirname, './dist'),
  filename: chunkhash,
  chunkFilename: chunkhash,
  publicPath: '/',
},
```

### 4. 生产环境抽离每一个 chunk 的 css 使用 MiniCssExtractPlugin
```
module: {
  rules: [
    {
      test: /\.(css|less)$/,
      use: {
        loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader
      },
    }
  ]
}
plugins: [
  new MiniCssExtractPlugin({
      filename: contenthash,
      chunkFilename: contenthash,
    }),
]
```
### 5. 分离第三方插件，持久化缓存
$ yarn add uglifyjs-webpack-plugin 
```
optimization: {
  runtimeChunk: {
    name: 'manifest',
  },
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
        name: 'vendor',
      },
    },
  },
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
    }),
    new OptimizeCSSAssetsPlugin(),
  ],
},
```