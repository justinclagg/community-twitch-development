/* Configure Environment Variables */
if (process.env.NODE_ENV === 'production') {
	const parseHerokuEnv = require('./utils/parseHerokuEnv.js');
	parseHerokuEnv();
}
else if (process.env.NODE_ENV === 'test') {
	const env = require('dotenv').config({path: './.env.test'});
	const parseDotenv = require('./utils/parseDotenv.js').parseDotenv;	
	parseDotenv(env);
}
else {
	const env = require('dotenv').config({path: './.env.dev'});
	const parseDotenv = require('./utils/parseDotenv.js').parseDotenv;
	parseDotenv(env);
}

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const mongoose = require('mongoose');
const db = mongoose.connection;
const MongoStore = require('connect-mongo')(session);
mongoose.connect(process.env.MONGODB_URI, { config: { autoIndex: false } });
mongoose.Promise = global.Promise; // Use native promises for mongoose

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);

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
require('./middleware/passport.js')(passport);

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
	const webpackConfig = require('../webpack.dev.config.js');
	const compiler = webpack(webpackConfig);
	app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
	app.use(webpackHotMiddleware(compiler));
	// Logging
	const morgan = require('morgan');
	app.use(morgan('dev'));
}

/* MongoDB */

db.once('open', () => {
	server.listen(process.env.PORT, (err) => {
		if (err) throw `Error starting server: ${err}`;
		console.log(`Node server on port ${process.env.PORT}`);
	});
});

db.on('disconnected', () => {
	mongoose.connect(process.env.MONGODB_URI, { config: { autoIndex: false } });
});

db.on('error', (err) => {
	console.log(`Database error: ${err}`);
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

const cache = require('./config/redisConfig.js');

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

app.use(require('./routes'));

module.exports = app;