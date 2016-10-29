const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
	category: String,
	name: String,
	description: String,
	claims: Array,
	submissions: Array,
	archive: Boolean
});

module.exports = mongoose.model('Task', taskSchema);