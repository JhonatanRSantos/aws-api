const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  entry        : slsw.lib.entries,
  target       : 'node',
  mode         : slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization : {
    minimize    : false,
    usedExports : true, // Tree shaking!
  },
  performance : {
    // Turn off size warnings for entry points
    hints : false,
  },
  externals : ['aws-sdk'],
  output    : {
    libraryTarget : 'commonjs',
    path          : path.join(__dirname, '.webpack'),
    filename      : '[name].js',
  },
  module : {
    rules : [
      { // Package js files.
        test    : /\.js$/,
        exclude : /node_modules/,
        use     : ['babel-loader'],
      },
      { // Package ts files.
        test    : /\.ts$/,
        exclude : /node_modules/,
        use     : ['babel-loader'],
      },
    ],
  },
  resolve : {
    extensions : ['.js', '.jsx', '.ts', '.tsx'],
  },
};
