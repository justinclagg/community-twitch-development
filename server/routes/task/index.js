const router = require('express').Router();
const authenticate = require('../../middleware/authenticate.js');
const requireRole = require('../../middleware/requireRole.js');
const task = require('./taskController.js');

router.route('/:category')
	.get(
		task.getAllInCategory()
	)
	// Add task to category
	.post(
		requireRole('admin'),
		task.add()
	)
	// Delete task
	.delete(
		requireRole('admin'),
		task.remove()
	)
	// Edit task
	.put(
		requireRole('admin'),
		task.edit()
	);

/* Claims API */

router.put('/claims/:category',
	authenticate(),
	task.editClaims()
);

/* Submissions API */

router.route('/submissions/:category')
	// Add a submission
	.put(
		authenticate(),
		task.addSubmission()
	)
	// Delete any submission (admin only)
	.delete(
		requireRole('admin'),
		task.deleteSubmission()
	);

router.route('/ownSubmission/:category')
	// Delete your own submission
	.delete(
		authenticate(),
		task.deleteOwnSubmission()
	);

/* Archive API */

router.put('/archive/:category',
	// Archive or unarchive a task
	requireRole('admin'),
	task.archive()
);

/* Admin Panel API */

router.get('/admin/submissions',
	// Get all tasks that have a submission
	requireRole('admin'),
	task.getAllSubmissions()
);

module.exports = router;