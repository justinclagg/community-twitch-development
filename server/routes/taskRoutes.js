const Task = require('../models/taskSchema.js');
const authenticate = require('../middleware/authenticate.js');
const requireRole = require('../middleware/requireRole.js');
const cacheTasks = require('../utils/cacheTasks.js');

module.exports = (cache, app) => {

	app.route('/live/tasks/:category')
		// Get tasks within category
		.get((req, res) => {
			cache.getAsync(req.params.category)
				.then(result => {
					if (result) {
						// Send cached tasks
						res.status(200).send(JSON.parse(result));
					}
					else {
						Task.find({ category: req.params.category })
							.then(tasks => {
								cache.setAsync(req.params.category, JSON.stringify(tasks));
								res.status(200).send(tasks);
							});
					}
				})
				.catch(err => {
					res.status(500).send(`Error getting tasks - ${err}`);
				});
		})
		// Add task to category
		.post(
			requireRole('admin'),
			(req, res, next) => {
				const newTask = new Task(req.body);
				newTask.save()
					.then(task => {
						res.status(201).send(task);
						cacheTasks(cache, req.params.category);
					})
					.catch(err => {
						return next(err);
					});
			}
		)
		// Delete task
		.delete(
			requireRole('admin'),
			(req, res, next) => {
				Task.findOneAndRemove({ _id: req.body._id })
					.then(() => {
						res.status(201).send();
						cacheTasks(cache, req.params.category);
					})
					.catch(err => {
						return next(err);
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
					}})
					.then(() => {
						res.status(201).send();
						cacheTasks(cache, req.params.category);
					})
					.catch(err => {
						return next(err);
					});
			}
		);
	
	/* Claims API */

	app.put('/live/claims/:category',
		authenticate(),
		(req, res, next) => {
			Task.update(
				{ _id: req.body._id },
				{ $set: { claims: req.body.claims } })
				.then(() => {
					res.status(201).send();
					cacheTasks(cache, req.params.category);
				})
				.catch(err => {
					return next(err);
				}); 
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
					{ $set: { submissions: req.body.submissions } })
					.then(() => {
						res.status(201).send();
						cacheTasks(cache, req.params.category);
					})
					.catch(err => {
						return next(err);
					});
			}
		)
		// Delete any submission (admin only)
		.delete(
			requireRole('admin'),
			(req, res, next) => {
				Task.update(
					{ _id: req.body._id },
					{ $set: { submissions: req.body.submissions } })
					.then(() => {
						res.status(201).send();
						cacheTasks(cache, req.params.category);
					})
					.catch(err => {
						return next(err);
					});
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
						{ $set: { submissions: req.body.submissions } })
						.then(() => {
							res.status(201).send();
							cacheTasks(cache, req.params.category);
						})
						.catch(err => {
							return next(err);
						});
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
				}})
				.then(() => {
					res.status(201).send();
					cacheTasks(cache, req.params.category);
				})
				.catch(err => {
					return next(err);
				});
		}
	);

	/* Admin Panel API */

	app.get('/live/admin/submissions',
		// Get all tasks that have a submission
		requireRole('admin'),
		(req, res, next) => {
			Task.find({ submissions: {$gt: []} })
				.then(tasks => {
					res.status(200).send(tasks);
				})
				.catch(err => {
					return next(err);
				});
		}
	);
};