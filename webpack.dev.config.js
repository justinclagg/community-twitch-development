var webpack = require('webpack');
var Dotenv = require('dotenv-webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

var path = require('path');
var SRC_DIR = path.resolve(__dirname, './client');
var DIST_DIR = path.resolve(__dirname, './public');

module.exports = {
	devtool: 'source-map',
	entry: {
		app: path.resolve(SRC_DIR, 'index.js'),
		vendor: [
			'webpack-hot-middleware/client',
			'whatwg-fetch',
			'material-ui',
			'react',
			'react-dom',
			'react-redux',
			'react-router',
			'react-tap-event-plugin',
			'redux',
			'redux-promise-middleware',
			'redux-thunk',
			'es6-promise',
			'linkifyjs'
		]
	},
	output: {
		path: DIST_DIR,
		filename: '[name].js',
		chunkFilename: '[name].js',
		publicPath: '/'
	},
	plugins: [
		new Dotenv({
			path: './.env.dev',
			safe: false
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'], minChunks: Infinity }),
		new HtmlWebpackPlugin({ template: './public/templates/index.ejs', filename: './templates/index.html', chunksSortMode: 'dependency' }),
		new InlineManifestWebpackPlugin({ name: 'webpackManifest' })
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: path.resolve(SRC_DIR),
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015'],
					plugins: ['transform-object-rest-spread']
				}
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: 'url?limit=10000!img?progressive=true'
			},
			{
				test: /\.scss$/,
				include: path.resolve(SRC_DIR, 'css'),
				loaders: ['style', 'css', 'sass']
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
	}
};