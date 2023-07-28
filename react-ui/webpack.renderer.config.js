const rules = require('./webpack.rules');


rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' }, 
    { loader: 'css-loader' }, 
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [require('tailwindcss')],
        },
      },
    },
], 

});


module.exports = {
  module: {
    rules,
  },

};
