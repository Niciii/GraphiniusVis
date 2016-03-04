var BrowserSyncPlugin = require('browser-sync-webpack-plugin');


module.exports = {
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'graphinius.vis.js'
  },
  target: "web",
  module: {
    loaders: [
      // { test: /\.css$/, loader: 'style!css!' },
      {
        test: /\.json$/,
        loader: 'json!'
      }
    ]
  },
  node: {
    fs: "empty",
    request: "empty",
    net: "empty",
    tls: "empty"
  },
  plugins: [
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['./'] }
    })
  ]
};
