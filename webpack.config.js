const webpack = require('webpack');
const path = require('path');

const common = {
  context: __dirname + '/client',
};

const client = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'env']
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  entry: './client.js',
  output: {
    path: __dirname + '/client/dist',
    filename: 'bundle.js'
  }
};

const server = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'env']
        },
      },
      {
        test: /\.css$/,
        use: ['css-loader']
      }
    ],
  },
  entry: './server.js',
  target: 'node',
  output: {
    path: __dirname + '/client/dist',
    filename: 'bundle-server.js',
    libraryTarget: 'commonjs-module'
  }
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server)
];
