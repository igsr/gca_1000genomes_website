const path = require('path');

module.exports = {
  entry: './app/main.ts',
  output: { path: path.resolve(__dirname, 'static'), filename: 'build.js' },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: { configFile: 'tsconfig.webpack.json', transpileOnly: true },
          },
          'angular2-template-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        options: { esModule: false },
      },
      {
        test: /\.css$/,
        loader: 'raw-loader',
        options: { esModule: false },
      },
    ],
  },
};
