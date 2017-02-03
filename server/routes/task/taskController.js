const Task = require('../../models/Task.js');
const cache = require('../../utils/cache.js');
const redisClient = require('../../config/redisConfig.js');

function getAllInCategory() {
    return (req, res) => {
        const { category } = req.params;
        return redisClient.getAsync(category)
            .then(result => {
                if (result) {
                    // Send cached tasks
                    res.status(200).send(JSON.parse(result));
                }
                else {
                    Task.getTasksInCategory(category)
                        .then(tasks => {
                            redisClient.setAsync(category, JSON.stringify(tasks));
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
        return Task.removeOne(req.body._id)
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
        const { _id, name, description } = req.body;
        Task.editNameAndDescription(_id, name, description)
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
        const { _id, claims } = req.body;
        Task.editClaims(_id, claims)
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
        const { _id, submissions } = req.body;
        Task.addSubmission(_id, submissions)
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
        const { _id, submissions } = req.body;
        Task.deleteSubmission(_id, submissions)
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
        const { _id, submissions, submissionUsername } = req.body;
        if (submissionUsername === req.user.username) {
            Task.deleteSubmission(_id, submissions)
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
        const { _id, archive } = req.body;
        Task.setArchive(_id, archive)
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
        Task.getAllSubmissions()
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