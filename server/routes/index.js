const path = require('path');

module.exports = (cache, app, passport) => {

	app.get('/', (req, res) => {
		res.sendFile(path.resolve('./public/templates/index.html'));
	});

	require('./taskRoutes')(cache, app);
	require('./categoryRoutes')(cache, app);
	require('./userRoutes')(cache, app, passport);

	// Allows for browserHistory routing. Place after all API routes
	app.get('/*', (req, res) => {
		res.sendFile(path.resolve('./public/templates/index.html'));
	});
};