const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 优化
const HappyPack = require('happypack');

// 共享进程池， 以防止资源占用过多
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const isDev = process.env.NODE_ENV !== 'production';

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode: mode,
  devtool: isDev ? 'source-map' : false,
  entry: './src/library/components/index.js',

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'huge-tree.js',
    library: 'hugeTree',
    libraryTarget: 'umd',
    libraryExport: 'default', // 增加这个属性
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
        use: ['style-loader', 'happypack/loader?id=style'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'happypack/loader?id=sass'],
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
    new CleanWebpackPlugin(), // 多版本共存模式时 必须要取消这个插件
    new VueLoaderPlugin(),
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
