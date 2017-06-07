var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: ["./main.js"],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    filename: "bundle.js"
  },
  devServer: {
    hot: true,
    inline: true,
    port: 3000
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["es2015", "react"]
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
  ],
  resolve: {
    alias: {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}