
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

module.exports = {
  entry: './src/main.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.web.js', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.png'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
      'react-native/Libraries/Utilities/codegenNativeComponent': 'react-native-web/dist/exports/codegenNativeComponent',
      'react-native/Libraries/Utilities/codegenNativeCommands': 'react-native-web/dist/exports/codegenNativeCommands',
      'react-native/Libraries/EventEmitter/NativeEventEmitter': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',
      'react-native-safe-area-context': 'react-native-safe-area-context/lib/module',
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    plugins: [
      new DirectoryNamedWebpackPlugin(true),
    ],
  },
  module: {
    rules: [
      {
        test: /.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/react-native'),
          path.resolve(__dirname, 'node_modules/react-native-screens'),
          path.resolve(__dirname, 'node_modules/@react-navigation'),
          path.resolve(__dirname, 'node_modules/react-native-safe-area-context'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            plugins: ['babel-plugin-react-native-web'],
          },
        },
      },
      {
        test: /.(png|jpg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8080,
    open: true,
  },
};
