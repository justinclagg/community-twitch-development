const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    gitlabId: String,
});

User.statics.getUser = function (_id) {
    return this.findOne({ _id });
};

User.statics.createAndSave = function (props) {
    return this.create(props);
};

User.methods.unlinkGitlab = function () {
    this.gitlabId = '';
    return this.save();
};

User.methods.linkGitlab = function (gitlabId) {
    this.gitlabId = gitlabId;
    return this.save();
};

User.methods.updateRole = function (newRole) {
    this.role = newRole;
    return this.save();
};

module.exports = mongoose.model('User', User);