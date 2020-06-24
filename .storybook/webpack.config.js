const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, '../src/index.js'),
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(s?css|sass)$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[local]___[hash:base64:5]',
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: [
					/node_modules/, 
				],
				loader: "babel-loader",
				  options: {
					  presets: [
						  '@babel/preset-env',
						  '@babel/react',
						  {
							'plugins': ['@babel/plugin-proposal-class-properties'],
						}
					]
				  }
			  },
			  {
				test: /\.(woff2?|ttf|eot|jpe?g|png|gif|mp4|mov|ogg|webm)(\?.*)?$/i,
				use: [
					'file-loader',
				],
				},
			  {
				test: /\.svg$/,
				use: [
					'desvg-loader/react',
					'svg-loader',
					'image-webpack-loader',
				],
			}
		]
	},
	devServer: {
		compress: true,
		port: 9000
	},
	resolve: {
		alias: {
			'styles': path.join(__dirname, '../src/styles'),
			'autoI18n': path.resolve(__dirname, '../src/i18n'),
			'icons': path.join(__dirname, '../src/icons'),
			'components': path.join(__dirname, '../src/components'),
		},
	},
}