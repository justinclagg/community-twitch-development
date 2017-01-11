const Task = require('../models/taskSchema.js');
const authenticate = require('../middleware/authenticate.js');
const requireRole = require('../middleware/requireRole.js');
const cacheTasks = require('../utils/cacheTasks.js');

module.exports = (cache, app) => {

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
					res.status(201).send(newTask);
					cacheTasks(cache, req.params.category);
				});
			}
		)
		// Delete task
		.delete(
			requireRole('admin'),
			(req, res, next) => {
				Task.findOneAndRemove({ _id: req.body._id }, (err) => {
					if (err) return next(err);
					res.status(201).send();
					cacheTasks(cache, req.params.category);
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
						res.status(201).send();
						cacheTasks(cache, req.params.category);
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
					res.status(201).send();
					cacheTasks(cache, req.params.category);
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
						res.status(201).send();
						cacheTasks(cache, req.params.category);
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
						res.status(201).send();
						cacheTasks(cache, req.params.category);
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
							res.status(201).send();
							cacheTasks(cache, req.params.category);
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
					res.status(201).send();
					cacheTasks(cache, req.params.category);
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
};