const path = require('path'); // Corrigido: path estava com um apóstrofo extra
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js', // Ponto de entrada do seu aplicativo
  output: {
    path: path.resolve(__dirname, 'dist'), // Pasta de saída
    filename: 'bundle.js', // Nome do arquivo de saída
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Processa arquivos .js
        exclude: /node_modules/, // Ignora a pasta node_modules
        use: {
          loader: 'babel-loader', // Usa o Babel para transpilar JavaScript
        },
      },
      {
        test: /\.scss$/, // Processa arquivos .scss
        use: ['style-loader', 'css-loader', 'sass-loader'], // Loaders para SASS
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Processa arquivos de imagem
        use: [
          {
            loader: 'file-loader', // Usa o file-loader para carregar imagens
            options: {
              name: '[path][name].[ext]', // Mantém o nome e o caminho original do arquivo
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Usa o template HTML
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'), // Servir arquivos estáticos da pasta public
    compress: false,
    port: 3000,
  },
};
