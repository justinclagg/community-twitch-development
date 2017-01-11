require('isomorphic-fetch');
const User = require('../models/userSchema.js');
const authenticate = require('../middleware/authenticate.js');
const requireRole = require('../middleware/requireRole.js');

module.exports = (cache, app, passport) => {

	/* User Login */

	app.get('/auth/twitch', passport.authenticate('twitchtv'));

	app.get(process.env.TWITCH_CALLBACK,
		passport.authenticate('twitchtv', { successRedirect: '/', failureRedirect: '/' })
	);

	app.post('/auth/checkLogin',
		authenticate(),
		(req, res) => {
			res.status(200).send(req.user);
		}
	);

	/* User Logout */

	app.post('/auth/logout',
		authenticate(),
		(req, res) => {
			req.logout();
			res.redirect('/');
		}
	);

	/* Gitlab */

	app.get('/auth/gitlab',
		requireRole(process.env.GITLAB_ACCESS_LEVEL),
		passport.authenticate('gitlab', { scope: ['api'] })
	);

	app.get(process.env.GITLAB_CALLBACK,
		passport.authenticate('gitlab', { successRedirect: '/profile', failureRedirect: '/profile' })
	);

	app.post('/auth/gitlab/unlink',
		requireRole(process.env.GITLAB_ACCESS_LEVEL),
		(req, res, next) => {
			const { GITLAB_GROUP_ID, GITLAB_ACCESS_TOKEN } = process.env;
			fetch(`https://gitlab.com/api/v3/groups/${GITLAB_GROUP_ID}/members/${req.user.gitlabId}`, {
				method: 'DELETE',
				headers: { 'PRIVATE-TOKEN': GITLAB_ACCESS_TOKEN }
			})
			.then(response => {
				if (response.ok) {
					User.findOne({ _id: req.user._id }, (err, user) => {
						if (err) {
							res.status(500).send();
						}
						else if (user) {
							user.gitlabId = '';
							user.save(err => {
								if (err) return next(err);
								res.status(201).send(user);
							});
						}
						else {
							res.status(500).send();
						}
					});
				}
				else {
					res.status(500).send('Error removing gitlab permissions');
				}
			})
			.catch(err => {
				console.log(`Fetch error: ${err}`);
			});
		}
	);
};