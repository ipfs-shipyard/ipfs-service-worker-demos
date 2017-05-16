module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'public-with-sw/service-worker-bundle.js'
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
