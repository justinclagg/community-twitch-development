const Task = require('../../models/Task.js');
const cache = require('../../utils/cache.js');
const redisClient = require('../../config/redisConfig.js');

function getAllInCategory() {
	return (req, res) => {
		return redisClient.getAsync(req.params.category)
			.then(result => {
				if (result) {
					// Send cached tasks
					res.status(200).send(JSON.parse(result));
				}
				else {
					Task.getTasksInCategory(req.params.category)
						.then(tasks => {
							redisClient.setAsync(req.params.category, JSON.stringify(tasks));
							res.status(200).send(tasks);
						});
				}
			})
			.catch(err => {
				res.status(500).send(`Error getting tasks - ${err}`);
			});
	};
}

function add() {
	return (req, res) => {
		return Task.createAndSave(req.body)
			.then(task => {
				res.status(201).send(task);
				cache.tasks(req.params.category);
			})
			.catch(err => {
				res.status(500).send(`Error posting task - ${err}`);
			});
	};
}

function remove() {
	return (req, res) => {
		return Task.findOneAndRemove({ _id: req.body._id })
			.then(() => {
				res.status(201).send();
				cache.tasks(req.params.category);
			})
			.catch(err => {
				res.status(500).send(`Error deleting task - ${err}`);
			});
	};
}

function edit() {
	return (req, res) => {
		Task.update(
			{ _id: req.body._id },
			{
				$set: {
					name: req.body.name,
					description: req.body.description
				}
			})
			.then(() => {
				res.status(201).send();
				cache.tasks(req.params.category);
			})
			.catch(err => {
				res.status(500).send(`Error editing task - ${err}`);
			});
	};
}

function editClaims() {
	return (req, res) => {
		Task.update(
			{ _id: req.body._id },
			{ $set: { claims: req.body.claims } })
			.then(() => {
				res.status(201).send();
				cache.tasks(req.params.category);
			})
			.catch(err => {
				res.status(500).send(`Error editing task claims - ${err}`);
			});
	};
}

function addSubmission() {
	return (req, res) => {
		Task.update(
			{ _id: req.body._id },
			{ $set: { submissions: req.body.submissions } })
			.then(() => {
				res.status(201).send();
				cache.tasks(req.params.category);
			})
			.catch(err => {
				res.status(500).send(`Error adding task submission - ${err}`);
			});
	};
}

function deleteSubmission() {
	return (req, res) => {
		Task.update(
			{ _id: req.body._id },
			{ $set: { submissions: req.body.submissions } })
			.then(() => {
				res.status(201).send();
				cache.tasks(req.params.category);
			})
			.catch(err => {
				res.status(500).send(`Error deleting task submission - ${err}`);
			});
	};
}

function deleteOwnSubmission() {
	return (req, res) => {
		if (req.body.submissionUsername === req.user.username) {
			Task.update(
				{ _id: req.body._id },
				{ $set: { submissions: req.body.submissions } })
				.then(() => {
					res.status(201).send();
					cache.tasks(req.params.category);
				})
				.catch(err => {
					res.status(500).send(`Error deleting own task submission - ${err}`);
				});
		}
		else {
			res.status(401).send();
		}
	};
}

function archive() {
	return (req, res) => {
		Task.update(
			{ _id: req.body._id },
			{
				$set: {
					archive: req.body.archive
				}
			})
			.then(() => {
				res.status(201).send();
				cache.tasks(req.params.category);
			})
			.catch(err => {
				res.status(500).send(`Error during task archive - ${err}`);
			});
	};
}

function getAllSubmissions() {
	return (req, res) => {
		Task.find({ submissions: { $gt: [] } })
			.then(tasks => {
				res.status(200).send(tasks);
			})
			.catch(err => {
				res.status(500).send(`Error getting all task submissions - ${err}`);
			});
	};
}

module.exports = {
	getAllInCategory,
	add,
	remove,
	edit,
	editClaims,
	addSubmission,
	deleteSubmission,
	deleteOwnSubmission,
	archive,
	getAllSubmissions
};