// webpack.config.js
const path = require("path");
const webpack = require("./node_modules/webpack");
const VueLoaderPlugin = require("./node_modules/vue-loader/lib/plugin");

module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: {
    app: ["./custom-map.js"]
  },
  output: {
    path: path.resolve(__dirname, "./js"),
    filename: "custom-map.bundle.js"
  },
  mode: 'production',
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: { presets: ["@babel/env"] }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader"
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  }
};
