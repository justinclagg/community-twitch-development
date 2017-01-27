const path = require('path');
const router = require('express').Router();

router.use('/task', require('./task'));
router.use('/category', require('./category'));
router.use('/user', require('./user'));

router.get('/', (req, res) => {
	res.sendFile(path.resolve('./public/templates/index.html'));
});

// Allows for browserHistory routing. Place after all API routes
router.get('/*', (req, res) => {
	res.sendFile(path.resolve('./public/templates/index.html'));
});

module.exports = router;