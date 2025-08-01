const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

module.exports = {
  entry: "./src/main.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    globalObject: "this",
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  target: "web",
  resolve: {
    extensions: [
      ".web.js",
      ".web.ts", 
      ".web.tsx",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".json",
      ".css",
      ".png",
    ],
    alias: {
      "react-native$": "react-native-web",
      "react-native/Libraries/Utilities/Platform":
        "react-native-web/dist/exports/Platform",
      "react-native/Libraries/Utilities/codegenNativeComponent":
        "react-native-web/dist/exports/codegenNativeComponent",
      "react-native/Libraries/Utilities/codegenNativeCommands":
        "react-native-web/dist/exports/codegenNativeCommands",
      "react-native/Libraries/EventEmitter/NativeEventEmitter":
        "react-native-web/dist/vendor/react-native/NativeEventEmitter",
      "react-native-safe-area-context":
        "react-native-safe-area-context/lib/module",
    },
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    plugins: [new DirectoryNamedWebpackPlugin(true)],
    fallback: {
      "crypto": false,
      "buffer": require.resolve("buffer/"),
      "stream": false,
      "util": false,
      "assert": false,
      "http": false,
      "url": false,
      "https": false,
      "os": false,
      "fs": false,
      "path": false,
    },
  },
  module: {
    rules: [
      {
        test: /.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules/react-native"),
          path.resolve(__dirname, "node_modules/react-native-screens"),
          path.resolve(__dirname, "node_modules/@react-navigation"),
          path.resolve(
            __dirname,
            "node_modules/react-native-safe-area-context"
          ),
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 2 versions"],
                  },
                  modules: false,
                },
              ],
              [
                "@babel/preset-react",
                {
                  runtime: "classic",
                },
              ],
              "@babel/preset-typescript",
            ],
            plugins: [
              "babel-plugin-react-native-web",
              "@babel/plugin-transform-runtime",
            ],
          },
        },
      },
      {
        test: /.(js|jsx)$/,
        include: /node_modules\/@react-navigation/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 2 versions"],
                  },
                  modules: "commonjs",
                },
              ],
            ],
            plugins: [
              "@babel/plugin-transform-modules-commonjs",
            ],
          },
        },
      },
      {
        test: /.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
      "global": "globalThis",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
      global: "globalThis",
      React: "react",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 8080,
    open: true,
  },
};
