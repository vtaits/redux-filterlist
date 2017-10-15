const webpack = require('webpack')
const path = require('path')

const context = path.join(__dirname, 'src')

module.exports = {
  context,
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: [/(\.js)/, /(\.jsx)/],
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', { modules: false }],
            'react',
            'stage-2',
          ],
        },
      }],
    }],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },
}
