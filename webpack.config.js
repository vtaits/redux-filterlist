const webpack = require('webpack')
const path = require('path')

const context = path.join(__dirname, 'src')

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
}

const reduxExternal = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux',
}

const reactReduxExternal = {
  root: 'ReactRedux',
  commonjs2: 'react-redux',
  commonjs: 'react-redux',
  amd: 'react-redux',
}

module.exports = function(env) {
  const nodeEnv = process.env.NODE_ENV
  const isProd = nodeEnv === 'production'

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
  ]

  if (isProd) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
      })
    )
  }

  const filename = isProd ?
    './redux-filterlist.min.js' :
    './redux-filterlist.js'

  return {
    context,
    entry: './index.js',
    externals: {
      react: reactExternal,
      redux: reduxExternal,
      'react-redux': reactReduxExternal,
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename,
      library: 'ReduxFilterlist',
      libraryTarget: 'umd',
    },
    plugins,
    module: {
      rules: [{
        test: /(\.js)/,
        use: [{
          loader: 'babel-loader',
        }],
      }],
    },
    resolve: {
      modules: [
        context,
        'node_modules',
      ],
      extensions: ['.js'],
    },
  }
}
