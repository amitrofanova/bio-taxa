var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ['babel-polyfill', "./src/index.js"],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.sass$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          "file-loader"
        ]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    historyApiFallback: true,
    hotOnly: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
  ]
};
