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
    tls: 'empty',
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        Buffer: true,
        setImmediate: false,
        console: false
    },

    resolve: {
    alias: {
      zlib: 'browserify-zlib-next'
    }
  }
}
