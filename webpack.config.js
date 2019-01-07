var path = require('path');
var nodeExternals = require('webpack-node-externals');

var browserConfig = {
	entry: './src/client/main.js',
	output: {
		path: path.join(__dirname, 'build/assets'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
};

var serverConfig = {
	entry: [ '@babel/polyfill', './src/server/main.js' ],
	target: 'node',
	externals: [nodeExternals()],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'server.js',
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				use: 'babel-loader',
			},
		],
	},
};

module.exports = [
	browserConfig,
	serverConfig,
];
