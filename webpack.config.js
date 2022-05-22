const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = (env) => {  
  return {
    entry: './index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, `dist${env?.mode === 'development' ? '/dev' : ''}`)
    },
    target: 'node',
    externals: [nodeExternals()],
    mode: env?.mode || 'production'
  }
}