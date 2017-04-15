var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: ["./main.js"],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["env", "react"]
        }
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!less-loader"})
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css")
  ]
}