const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      // Add loaders for other file types like CSS, Less, etc.
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      
      },
      {
        test: /\.less$/,
        use:  ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      }
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 9000,
  },
  mode: 'development'
};
