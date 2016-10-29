const path = require('path');
const fetch = require('node-fetch');

const Task = require('../models/taskSchema.js');
const User = require('../models/userSchema.js');

const authenticate = require('../middleware/authenticate.js');
const requireRole = require('../middleware/requireRole.js');
const cacheCategories = require('../utils/cacheCategories.js');
const cacheTasks = require('../utils/cacheTasks.js');

module.exports = (cache, app, passport) => {

	app.get('/', (req, res) => {
		res.sendFile(path.resolve('./public/templates/index.html'));
	});

	/* Categories API */

	app.route('/live/categories')
		// Get a list of categories
		.get((req, res) => {
			cache.get('categoryList', (err, result) => {
				if (result) {
					res.status(200).send(result.split(','));
				}
				else {
					cacheCategories(cache, res);
				}
			});
		})
		// Add a new category
		.post(
			requireRole('admin'),
			(req, res, next) => {
				Task.findOne({ name: req.body.category, category: null }, (err, category) => {
					if (err) {
						res.status(500).send(`Database error adding category: ${err}`);						
					}
					else if (category) {
						res.status(500).send('Category already exists');
					}
					else {
						// New category, store in database and cache
						let newCategory = new Task();
						newCategory.name = req.body.category;
						newCategory.category = null;
						newCategory.save(err => {
							if (err) return next(err);
							cacheCategories(cache, res);
						});
					}
				});
			}
		)
		// Delete a category
		.delete(
			requireRole('admin'),
			(req, res, next) => {
				// Delete all tasks within category
				Task.remove({ category: req.body.category }, (err) => {
					if (err) return next(err);
					cacheTasks(cache, req.body.category);
				});
				// Delete category
				Task.findOneAndRemove({ name: req.body.category, category: null }, (err) => {
					if (err) return next(err);
					cacheCategories(cache, res);
				});
			}
		);

	/* Task API */

	app.route('/live/tasks/:category')
		// Get tasks within category
		.get((req, res, next) => {
			cache.get(req.params.category, (err, result) => {
				if (result) {
					res.status(200).send(JSON.parse(result));
				}
				else {
					Task.find({ category: req.params.category }, (err, tasks) => {
						if (err) return next(err);
						res.status(200).send(tasks);
						cache.set(req.params.category, JSON.stringify(tasks), (err) => {
							if (err) return next(err);
						});
					});
				}
			});
		})
		// Add task to category
		.post(
			requireRole('admin'),
			(req, res, next) => {
				let newTask = new Task(req.body);
				newTask.save((err, newTask) => {
					if (err) return next(err);
					cacheTasks(cache, req.params.category, res, newTask);
				});
			}
		)
		// Delete task
		.delete(
			requireRole('admin'),
			(req, res, next) => {
				Task.findOneAndRemove({ _id: req.body._id }, (err) => {
					if (err) return next(err);
					cacheTasks(cache, req.params.category, res);
				});
			}
		)
		// Edit task
		.put(
			requireRole('admin'),
			(req, res, next) => {
				Task.update(
					{ _id: req.body._id },
					{ $set: {
						name: req.body.name,
						description: req.body.description
					}},
					(err) => {
						if (err) return next(err);
						cacheTasks(cache, req.params.category, res);
					}
				);
			}
		);

	/* Claims API */

	app.put('/live/claims/:category',
		authenticate(),
		(req, res, next) => {
			Task.update(
				{ _id: req.body._id },
				{ $set: { claims: req.body.claims } }, 
				(err) => {
					if (err) return next(err);
					cacheTasks(cache, req.params.category, res);
				}
			);
		}
	);

	/* Submissions API */

	app.route('/live/submissions/:category')
		// Add a submission
		.put(
			authenticate(),
			(req, res, next) => {
				Task.update(
					{ _id: req.body._id },
					{ $set: { submissions: req.body.submissions } }, 
					(err) => {
						if (err) return next(err);
						cacheTasks(cache, req.params.category, res);
					}
				);
			}
		)
		// Delete any submission (admin only)
		.delete(
			requireRole('admin'),
			(req, res, next) => {
				Task.update(
					{ _id: req.body._id },
					{ $set: { submissions: req.body.submissions } }, 
					(err) => {
						if (err) return next(err);
						cacheTasks(cache, req.params.category, res);
					}
				);
			}
		);
	
	app.route('/live/ownSubmission/:category')
		// Delete your own submission
		.delete(
			authenticate(),
			(req, res, next) => {
				if (req.body.submissionUsername === req.user.username) {
					Task.update(
						{ _id: req.body._id },
						{ $set: { submissions: req.body.submissions } }, 
						(err) => {
							if (err) return next(err);
							cacheTasks(cache, req.params.category, res);
						}
					);
				}
				else {
					res.status(401).send();
				}
			}
		);

	/* Archive API */

	app.put('/live/archive/:category',
		// Archive or unarchive a task
		requireRole('admin'),
		(req, res, next) => {
			Task.update(
				{ _id: req.body._id },
				{ $set: {
					archive: req.body.archive
				}},
				(err) => {
					if (err) return next(err);
					cacheTasks(cache, req.params.category, res);
				}
			);
		}
	);

	/* Admin Panel API */

	app.get('/live/admin/submissions',
		// Get all tasks that have a submission
		requireRole('admin'),
		(req, res, next) => {
			Task.find({ submissions: {$gt: []} }, (err, tasks) => {
				if (err) return next(err);
				res.status(200).send(tasks);
			});
		}
	);

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

	// Allows for browserHistory routing. Place after all API routes
	app.get('/*', (req, res) => {
		res.sendFile(path.resolve('./public/templates/index.html'));
	});
};