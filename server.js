/* Configure Environment Variables */
if (process.env.NODE_ENV === 'production') {
	const parseHerokuEnv = require('./server/utils/parseHerokuEnv.js');
	parseHerokuEnv();
}
else if (process.env.NODE_ENV === 'test') {
	const env = require('dotenv').config({path: './.env.test'});
	const parseDotenv = require('./server/utils/parseDotenv.js').parseDotenv;	
	parseDotenv(env);
}
else {
	const env = require('dotenv').config();
	const parseDotenv = require('./server/utils/parseDotenv.js').parseDotenv;
	parseDotenv(env);
}

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Promise = require('es6-promise').Promise;

const mongoose = require('mongoose');
const db = mongoose.connection;
const MongoStore = require('connect-mongo')(session);
mongoose.connect(process.env.MONGODB_URI, { config: { autoIndex: false } });
mongoose.Promise = Promise; // Replaces mpromise (deprecated)

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/* Apply Middleware */

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	secret: process.env.SESSION_SECRET,
	store: new MongoStore({
		mongooseConnection: db,
		ttl: 7 * 24 * 3600,
		touchAfter: 24 * 3600
	}),
	saveUninitialized: false,
	resave: false,
	cookie: {
		secure: false
	}
}));

app.use(passport.initialize());
app.use(passport.session());
require('./server/middleware/passport.js')(passport);

if (process.env.NODE_ENV === 'production') {
	// Production only middleware
	app.use(express.static('./public', { maxAge: '1y' }));
	app.use(express.static('./public/templates', { maxAge: 0 }));
	// Broadcast socket.io events to multiple servers
	const socketRedis = require('socket.io-redis');
	const adapter = socketRedis(process.env.REDIS_URL);
	io.adapter(adapter);
	adapter.pubClient.on('error', (err) => console.log('socket adapter publish error: ' + err));
	adapter.subClient.on('error', (err) => console.log('socket adapter subscribe error: ' + err));
}
else if (process.env.NODE_ENV === 'development') {
	// Development only middleware
	// Webpack hot reloading
	const webpack = require('webpack');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
	const webpackConfig = require('./webpack.dev.config.js');
	const compiler = webpack(webpackConfig);
	app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
	app.use(webpackHotMiddleware(compiler));
	// Logging
	const morgan = require('morgan');
	app.use(morgan('dev'));
}

/* MongoDB */

db.on('error', (err) => {
	console.log(`Database error: ${err}`);
	mongoose.connect(process.env.MONGODB_URI, { config: { autoIndex: false } });
});

db.once('open', () => {
	server.listen(process.env.PORT, (err) => {
		if (err) throw `Error starting server: ${err}`;
		console.log(`Node server on port ${process.env.PORT}`);
	});
});

/* Socket.io */

io.on('connection', (socket) => {
	socket.on('task modal', (task) => {
		socket.broadcast.emit('task modal', task);
	});
	socket.on('submissions', (task) => {
		socket.broadcast.emit('submissions', task);
	});
	socket.on('tasks', () => {
		socket.broadcast.emit('tasks');
	});
	socket.on('categories', () => {
		socket.broadcast.emit('categories');
	});
});

/* Redis */

const cache = require('redis').createClient(process.env.REDIS_URL, {
	no_ready_check: true,
	retry_strategy: function (options) {
		if (options.error && options.error.code === 'ECONNREFUSED') {
			// End reconnecting on a specific error and flush all commands with a individual error
			return new Error('The server refused the connection');
		}
		if (options.total_retry_time > 1000 * 60 * 60) {
			// End reconnecting after a specific timeout and flush all commands with a individual error
			return new Error('Retry time exhausted');
		}
		if (options.attempt > 10) {
			// End reconnecting with built in error
			return undefined;
		}
		// reconnect after
		return Math.max(options.attempt * 100, 3000);
	}
});

cache.on('connect', () => {
	console.log('Redis is connected');
});

cache.on('error', (err) => {
	console.log('Redis error: ' + err);
});

cache.on('end', () => {
	console.log('Redis connection ended');
});

/* Routes */

require('./server/routes')(cache, app, passport);

module.exports = app;