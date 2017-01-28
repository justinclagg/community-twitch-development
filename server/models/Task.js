const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema({
    category: { type: Schema.Types.Mixed, required: true },
    name: { type: String, required: true },
    description: String,
    claims: Array,
    submissions: Array,
    archive: { type: Boolean, required: true }
});

/* Static task methods */

Task.statics.createAndSave = function (props) {
    return this.create(props);
};

Task.statics.getTasksInCategory = function (category) {
    return this.find({ category });
};

Task.statics.removeOne = function (_id) {
    return this.findOneAndRemove({ _id });
};

Task.statics.editNameAndDescription = function (_id, name, description) {
    return this.update(
        { _id },
        { $set: { name, description } }
    );
};

Task.statics.editClaims = function (_id, claims) {
    return this.update(
        { _id },
        { $set: { claims } }
    );
};

Task.statics.addSubmission = function (_id, submissions) {
    return this.update(
        { _id },
        { $set: { submissions } }
    );
};

Task.statics.deleteSubmission = function (_id, submissions) { // Consider moving add/delete logic from client
    return this.update(
        { _id },
        { $set: { submissions } }
    );
};

Task.statics.setArchive = function (_id, archive) {
    return this.update(
        { _id },
        { $set: { archive } }
    );
};

Task.statics.getAllSubmissions = function () {
    return this.find({ submissions: { $gt: [] } });
};

/* Static category methods */

Task.statics.getCategory = function (category) {
    return this.findOne({ name: category, category: true });
};

Task.statics.removeCategory = function (name) {
    return this.findOneAndRemove({ name, category: true });
};

Task.statics.removeAllInCategory = function (category) {
    return this.remove({ category });
};

module.exports = mongoose.model('Task', Task);