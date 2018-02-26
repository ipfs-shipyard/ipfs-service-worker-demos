module.exports = {
  entry: {
    'service-worker-bundle': './src/index.js',
    bundle: './public+sw/index.js'
  },
  output: {
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
