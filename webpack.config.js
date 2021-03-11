const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 优化
const HappyPack = require('happypack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 共享进程池， 以防止资源占用过多
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const isDev = process.env.NODE_ENV !== 'production';
const chunkhash = isDev ? '[name].[hash:8].js' : '[name].[chunkhash:8].js';
const contenthash = isDev ? '[name].[hash:8].css' : '[name].[contenthash:8].css';
const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode: mode,
  devtool: isDev ? 'source-map' : false,
  entry: {
    app: './src/main.js',
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: chunkhash,
    chunkFilename: chunkhash,
    publicPath: isDev ? '/' : '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        use: ['happypack/loader?id=eslint'],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: ['happypack/loader?id=babel'],
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            // happpack 不支持 MiniCssExtractPlugin.loader
            loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          'happypack/loader?id=style',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            // happpack 不支持 MiniCssExtractPlugin.loader
            loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          'happypack/loader?id=sass',
        ],
      },
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
            loader: 'less-auto-import-loader',
            options: {
              url: '~@/assets/less/variable.less',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.resolve(__dirname, 'img/[name].[hash:7].[ext]'),
        },
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.resolve(__dirname, 'media/[name].[hash:7].[ext]'),
        },
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.resolve(__dirname, 'font/[name].[hash:7].[ext]'),
        },
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader',
          },
          {
            loader: 'vue-markdown-loader/lib/markdown-compiler',
            options: {
              raw: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    ...(isDev ? [] : [new CleanWebpackPlugin()]), // 多版本共存模式时 必须要取消这个插件
    ...(process.env.npm_config_report ? [new BundleAnalyzerPlugin()] : []),
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, './index.html') }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: contenthash,
      chunkFilename: contenthash,
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*'],
      },
    ]),
    ...happypack(),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve(__dirname, 'src'),
    },
  },

  resolveLoader: {
    modules: ['node_modules', './loaders/'],
  },

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
      new OptimizeCSSAssetsPlugin(),
    ],
  },

  devServer: {
    // history模式下的url会请求到服务器端，但是服务器端并没有这一个资源文件，就会返回404，所以需要配置这一项
    historyApiFallback: {
      index: '/index.html', //与output的publicPath有关(HTMLplugin生成的html默认为index.html)
    },
    // https: true,
    open: true,
    host: '0.0.0.0',
    port: 8000,
    disableHostCheck: true,
    hot: true,
    proxy: {
      //配置跨域，访问的域名会被代理到本地的3001端口
      '/api': 'http://localhost:3050',
      '/static': {
        target: 'http://localhost:3050',
        pathRewrite: { '^/static': '' },
      },
    },
  },
};

function happypack() {
  return [
    new HappyPack({
      id: 'eslint',
      loaders: ['eslint-loader'],
      threadPool: happyThreadPool,
    }),

    new HappyPack({
      id: 'babel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      ],
      threadPool: happyThreadPool,
    }),

    new HappyPack({
      id: 'style',
      loaders: [
        {
          loader: 'css-loader',
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
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'sass',
      loaders: [
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: { sourceMap: true },
        },
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ],
      threadPool: happyThreadPool,
    }),
  ];
}
