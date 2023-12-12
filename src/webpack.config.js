const path = require('path');

module.exports = {
  entry: './www/js/index.js', // Adjust this if your entry file is different
  output: {
    path: path.resolve(__dirname, 'www/js'), // Output directory
    filename: 'bundle.js' // Output file
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

