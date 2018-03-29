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

// var path = require('path');
// var SRC_DIR = path.join(__dirname, '/client/src');
// var DIST_DIR = path.join(__dirname, '/client/dist');

// module.exports = {
//   entry: `${SRC_DIR}/index.jsx`,
//   output: {
//     filename: 'bundle.js',
//     path: DIST_DIR
//   },
//   module : {
//     loaders : [
//       {
//         test : /\.jsx?/,
//         include : SRC_DIR,
//         loader : 'babel-loader',      
//         query: {
//           presets: ['react', 'es2015']
//        }
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader','css-loader']
//       }
//     ]
//   }
// };