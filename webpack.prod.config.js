var webpack = require('webpack');
var Dotenv = require('dotenv-webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

var path = require('path');
var SRC_DIR = path.resolve(__dirname, './client');
var DIST_DIR = path.resolve(__dirname, './public');

module.exports = {
	entry: {
		app: path.resolve(SRC_DIR, 'index.js'),
		vendor: [
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
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].js',
		publicPath: '/'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new Dotenv({
			path: './.env',
			safe: false
		}),
		new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, output: { comments: false } }),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'], minChunks: Infinity }),
		new WebpackMd5Hash(),
		new HtmlWebpackPlugin({ template: './public/templates/index.ejs', filename: './templates/index.html', chunksSortMode: 'dependency' }),
		new InlineManifestWebpackPlugin({ name: 'webpackManifest' }),
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: path.resolve(SRC_DIR),
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015'],
					plugins: ['transform-object-rest-spread']
				}
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