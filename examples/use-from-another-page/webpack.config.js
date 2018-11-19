const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  mode: 'development', // use only during development
  devtool: 'inline-source-map', // use only during development
  entry: {
    'service-worker-bundle': './sw/index.js',
    bundle: './public+sw/index.js'
  },
  optimization: {
    minimizer: [
      // Default flags break js-ipfs: https://github.com/ipfs-shipyard/ipfs-companion/issues/521
      new UglifyJsPlugin({
        parallel: true,
        extractComments: true,
        uglifyOptions: {
          compress: { unused: false },
          mangle: true
        }
      })
    ]
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'public+sw/[name].js'
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      zlib: 'browserify-zlib-next'
    }
  }
}
