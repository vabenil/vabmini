const path = require('path');

module.exports = {
   mode: "development",
   entry: "./src/index.ts",
   output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js"
   },
   resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [
         path.resolve(__dirname, "src"),
         'node_modules'
      ]
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: 'ts-loader'
         }
      ]
   }
}
