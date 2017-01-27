const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema({
	category: String,
	name: String,
	description: String,
	claims: Array,
	submissions: Array,
	archive: Boolean
});

Task.statics.createAndSave = function (props) {
	return this.create(props);
};

Task.statics.getTasksInCategory = function (category) {
	return this.find({ category });
};

module.exports = mongoose.model('Task', Task);