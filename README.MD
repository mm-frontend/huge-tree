> webpack学习的大致过程在此记录一下。<br>

先创建一份 vue-cli 作为参考。[https://cli.vuejs.org/zh/guide/installation.html](https://cli.vuejs.org/zh/guide/installation.html)
```
$ yarn global add @vue/cli
$ vue -V // 查看版本
$ vue init webpack vue-cli
```
然后创建 my-vue-cli 初始化项目结构，添加.gitignore等。
```
$ npm init
$ git init
```
### 1. 初始化webpack
[https://webpack.docschina.org/guides/installation/](https://webpack.docschina.org/guides/installation/)
```
// webpack 4.x+
$ yarn add webpack webapck-cli -D
```
### 2. 添加项目结构
- 入口文件：src/main.js, 在main.js中随便写点js。
- html模版文件：index.html
- webpack配置文件： webpack.config.js
### 3. webpack 基础配置
```
// webpack.config.js
const path = require('path')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash:8].js'
  }
}
```
```
// package.json
{
    "scripts": {
        "build": "webpack",
    }
}
```
```$ yarn build```, 会生成dist/app.\*\*.js, 将app.**.js在浏览器 console 中运行试试。(webpack 命令会自动查找 webapck.config.js 并执行)。

### 4. 使用devServer, HtmlWebpackPlugin
[webpack-dev-server](https://webpack.docschina.org/configuration/dev-server/) 
```
$ yarn add webpack-dev-server -D
$ yarn add html-webpack-plugin -D
```
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
[https://webpack.docschina.org/loaders/babel-loader/](https://webpack.docschina.org/loaders/babel-loader/)<br>
// 注意 babel-loader@7 与 babel-core@6 配套使用；babel-loader@8 与 babel-core@7 配套使用。
```
$ yarn add babel-loader babel-core babel-preset-env babel-preset-stage-2 -D
$ yarn add babel-plugin-transform-runtime babel-runtime -D
```
添加 ```.babelrc``` 文件
```
{
  // presets 告诉 babel 源码使用了哪些新的语法特性。
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ],
    "stage-2"
  ],
  // 生成的文件中，不产生注释, 会使 /* webpackChunkName: 'helloWorld' */ 失效
  // "comments": false,
  "plugins": [
    [
      // babel-plugin-transform-runtime 减少冗余代码，依赖 babel-runtime
      "transform-runtime",
      {
        "helpers": true,
        "polyfill": true,
        "regenerator": true,
        "moduleName": "babel-runtime"
      }
    ]
  ],
  "env": {
    // 测试环境，test 是提前设置的环境变量，如果没有设置BABEL_ENV, 则使用NODE_ENV，如果都没有设置默认就是development
    "test": {
      "presets": [
        "env",
        "stage-2"
      ],
      // instanbul是一个用来测试转码后代码的工具
      "plugins": [
        "istanbul"
      ]
    }
  }
}
```
```
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
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
}
```
### 6. 接入less、postcss
```
$ yarn add less less-loader css-loader style-loader -D
$ yarn add postcss-loader autoprefixer -D
```
添加```.postcssrc``` 文件。
```
{
  "plugins": {
    "autoprefixer": {
      "browsers": ["IOS>=7", "Android>=4.1", "IE>=9"],
    }
  }
}

```

### 7. 识别 .vue 文件
```
$ yarn add vue-loader vue-template-compiler -D
$ yarn add vue
```
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
### 11. 加入eslint + pritter + pre commit hook 约束代码提交
```
$ yarn add babel-eslint eslint eslint-config-standard eslint-plugin-html eslint-plugin-promise eslint-plugin-standard eslint-plugin-import eslint-plugin-node -D
$ yarn add eslint-loader -D
$ yarn add prettier -D --exact
$ yarn add eslint-plugin-prettier eslint-config-prettier eslint-plugin-vue -D
// lint-staged、 husky插件，这样再每次 commit 代码的时候都会格式化一下。
$ yarn add lint-staged husky@next -D
```
```
// 添加 .eslintrc.js
// 添加.prettierrc

// package.json
// pre-commit 约束代码提交
"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
"lint-staged": {
    "*.{js,json,css,md,vue}": ["prettier --write", "git add"]
  }

// webpack.config.js
module: {
  rules: [
     {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /(node_modules|bower_components)/,
      },
  ]
}
```
### 12. 使用 CopyWebpackPlugin
```
// copy custom static assets
new CopyWebpackPlugin([
  {
    from: path.resolve(__dirname, './static'),
    to: 'static',
    ignore: ['.*'],
  },
]),
```

## 优化
### 1. 区分环境
不同环境，使用不同配置插件等。
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
[https://webpack.docschina.org/concepts/mode/](https://webpack.docschina.org/concepts/mode/)
webpack4+ mode简化了许多配置。
```
const mode = process.env.NODE_ENV || 'development'

module.exports = {
  mode: mode,
}
```
### 3. 输出文件版本控制
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
[https://webpack.docschina.org/configuration/optimization/](https://webpack.docschina.org/configuration/optimization/)
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
### 6. 使用可视化分析 BundleAnalyzerPlugin
```
// package.json
scripts: {
  "analyz": "NODE_ENV=production npm_config_report=true npm run build"
}

// webpack.config.json
plugins: [
  ...(process.env.npm_config_report ? [new BundleAnalyzerPlugin()] : []),
]
```

## 3. 优化构建速度
### 1. 缩小文件搜素范围
### 2. 生成动态链接库 使用DllPlugin（将第三方插件只编译一次）
### 3. 利用 CUP 多核， 使用 HappyPack 加快 loader 转换
> webpack 构建流程中最耗时的就是 Loader 转换，js 单线程只能对文件一个一个的处理，HappyPack 原理就是将这部分任务，分解到多个进程，减少构建时间。

> 大中型项目中，使用 happypack 才能看到比较明显的构建速度提升。
```
// 见 git 记录"使用happypack"
```
### 4. 利用 CUP 多核， 使用 ParalleUglifyPlugin 加快 UglifyJS 的压缩。
```
new ParallelUglifyPlugin({
        uglifyJS: {
          output: {
            // 最紧凑输出
            beautify: false,
            // 删除所有注释
            comments: false,
          },
          compress: {
            drop_console: !isDev,
            collapse_vars: true,
            reduce_vars: true,
          },
        },
      }),
```

## 4. webpack 构建流程
1. 初始化：启动构建，读取合并配置参数，加载 Plugin，实例化 Compiler。
```
after-plugins: 调用完所有插件的 apply 方法。
```
2. 编译：从入口出发递归的编译 Module。
```
run: 启动一次新的编译。
compile: 告诉插件一次新的编译即将启动，会带上compiler对象
compilation: Compilation 对象包含了当前的模块资源、文件等。
after-compilation: compilation 完成。
```
3. 输出：将 Module 合并为 Chunk，输出到文件系统
```
emit: 文件输出，可以在这里获取和修改输出内容。
done: 成功的完成一次完整的编译和输出过程。
```

## 5. 编写 Loader
[https://webpack.docschina.org/contribute/writing-a-loader/](https://webpack.docschina.org/contribute/writing-a-loader/)
```
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                // happy 不支持 vue-loader， 将js 交由 happypack
                js: 'happypack/loader?id=babel',
              },
            },
          },
          {
            // 为每个 vue 文件 添加 ~@/assets/less/variable.less, 避免人工每次导入。
            loader: 'less-auto-import-loader',
            options: {
              url: '~@/assets/less/variable.less',
            },
          },
        ],
      },
    ]
  }
  resolveLoader: {
    // 增加 loader 的查找范围
    modules: ['node_modules', './loaders/'],
  },
}

```
## 6. 编写 Plugin

***重点是***找到合适的事件点去完成功能。[compiler 钩子](https://webpack.docschina.org/api/compiler-hooks/)
```
// EndWebpackPlugin webpack构建成功或失败后执行回调
class EndWebpackPlugin {
  constructor(doneCallback, failCallback) {
    this.doneCallback = doneCallback
    this.failCallback = failCallback
  }
  apply(compiler) {
    compiler.plugin('done', (stats) => {
      this.doneCallback(stats)
    })
    compiler.plugin('failed', (err) => {
      this.doneCallback(err)
    })
  }
}

// webpack.config.js
const EndWebpackPlugin = require('end-webpack-plugin');
plugins: [
  new EndWebpackPlugin((stats) => {}, (err) => {})
]
```
github: [https://github.com/lizhuang93/my-vue-cli](https://github.com/lizhuang93/my-vue-cli)<br>
webpack官网: [https://webpack.docschina.org/concepts/](https://webpack.docschina.org/concepts/)
