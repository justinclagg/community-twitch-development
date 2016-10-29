const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: String,
	username: String,
	email: String,
	role: String,
	gitlabId: String,
});

module.exports = mongoose.model('User', userSchema);