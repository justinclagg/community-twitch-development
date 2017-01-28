const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon); // Promise stubs run synchronously for testing
chai.use(sinonChai);
chai.should();

const Task = require('../../models/Task.js');
const factories = require('../factories.js');

describe('Task model', function () {

    describe('model validation', function () {
        it('category is required', function (done) {
            const taskProps = factories.newTask();
            const taskWithoutCategory = new Task({ ...taskProps, category: null });

            taskWithoutCategory.validate(err => {
                err.should.exist;
                done();
            });
        });

        it('archive is required', function (done) {
            const taskProps = factories.newTask();
            const taskWithoutArchive = new Task({ ...taskProps, archive: null });

            taskWithoutArchive.validate(err => {
                err.should.exist;
                done();
            });
        });

        it('name is required', function (done) {
            const taskProps = factories.newTask();
            const taskWithoutName = new Task({ ...taskProps, name: null });

            taskWithoutName.validate(err => {
                err.should.exist;
                done();
            });
        });

    });

    describe('createAndSave()', function () {
        it('saves a new task and returns the saved task', sinon.test(function () {
            const newTask = factories.newTask();
            const existingTask = factories.existingTask();
            const createStub = this.stub(Task, 'create').returnsPromise();
            createStub.resolves(existingTask);

            Task.createAndSave(newTask);

            createStub.should.be.calledWithExactly(newTask);
        }));
    });

    describe('getTasksInCategory()', function () {
        it('gets all tasks within the given category', sinon.test(function () {
            const existingTask = factories.existingTask();
            const category = factories.existingTask().category;
            const findStub = this.stub(Task, 'find').returnsPromise();
            findStub.resolves([existingTask]);

            Task.getTasksInCategory(category);

            findStub.should.be.calledWithExactly({ category });
        }));
    });

    describe('removeOne()', function () {
        it('removes a task', sinon.test(function () {
            const _id = factories.existingTask()._id;
            const findOneAndRemoveStub = this.stub(Task, 'findOneAndRemove').returnsPromise();
            findOneAndRemoveStub.resolves();

            Task.removeOne(_id);

            findOneAndRemoveStub.should.be.calledWithExactly({ _id });
        }));
    });

    describe('editNameAndDescription()', function () {
        it('edits the name and description of a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, name, description } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();
            updateStub.resolves();

            Task.editNameAndDescription(_id, name, description);

            updateStub.should.be.calledWithExactly({ _id }, { $set: { name, description } });
        }));
    });

    describe('editClaims()', function () {
        it('updates the claims of a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, claims } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();
            updateStub.resolves();

            Task.editClaims(_id, claims);

            updateStub.should.be.calledWithExactly({ _id }, { $set: { claims } });
        }));
    });

    describe('addSubmission()', function () {
        it('adds a submission to a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, submissions } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();
            updateStub.resolves();

            Task.addSubmission(_id, submissions);

            updateStub.should.be.calledWithExactly({ _id }, { $set: { submissions } });
        }));
    });

    describe('deleteSubmission()', function () {
        it('deletes a submission from a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, submissions } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();
            updateStub.resolves();

            Task.addSubmission(_id, submissions);

            updateStub.should.be.calledWithExactly({ _id }, { $set: { submissions } });
        }));
    });

    describe('setArchive()', function () {
        it('toggles the archived state of a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, archive } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();
            updateStub.resolves();

            Task.setArchive(_id, archive);

            updateStub.should.be.calledWithExactly({ _id }, { $set: { archive } });
        }));
    });

    describe('getAllSubmissions()', function () {
        it('gets all tasks that have a submission', sinon.test(function () {
            const findStub = this.stub(Task, 'find').returnsPromise();
            findStub.resolves([]);

            Task.getAllSubmissions();

            findStub.should.be.calledWithExactly({ submissions: { $gt: [] } });
        }));
    });

});