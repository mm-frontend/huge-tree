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
    publicPath: isDev ? '/' : './',
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
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              // happy 不支持 vue-loader， 将js 交由 happypack
              js: 'happypack/loader?id=babel',
            },
          },
        },
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
    ],
  },

  plugins: [
    ...(isDev ? [] : [new CleanWebpackPlugin()]), // 多版本共存模式时 必须要取消这个插件
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
    // https: true,
    open: true,
    host: '0.0.0.0',
    port: 8000,
    disableHostCheck: true,
    hot: true,
    proxy: {
      //配置跨域，访问的域名会被代理到本地的3000端口
      '/api': 'http://localhost:3000',
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
  ];
}
