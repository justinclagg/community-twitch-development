const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon); // Promise stubs run synchronously for testing
chai.use(sinonChai);

const Task = require('../../models/Task.js');
const factories = require('../factories.js');

describe('Task model', function () {

    describe('model validation', function () {

        it('category is required', function (done) {
            const taskProps = factories.newTask();
            const taskWithoutCategory = new Task({ ...taskProps, category: null });

            taskWithoutCategory.validate(err => {
                expect(err).to.exist;
                done();
            });
        });

        it('archive is required', function (done) {
            const taskProps = factories.newTask();
            const taskWithoutArchive = new Task({ ...taskProps, archive: null });

            taskWithoutArchive.validate(err => {
                expect(err).to.exist;
                done();
            });
        });

        it('name is required', function (done) {
            const taskProps = factories.newTask();
            const taskWithoutName = new Task({ ...taskProps, name: null });

            taskWithoutName.validate(err => {
                expect(err).to.exist;
                done();
            });
        });

    });

    describe('createAndSave()', function () {

        it('saves a new task and returns the saved task', sinon.test(function () {
            const newTask = factories.newTask();
            const createStub = this.stub(Task, 'create').returnsPromise();

            Task.createAndSave(newTask);

            expect(createStub)
                .to.be.calledWithExactly(newTask);
        }));
    });

    describe('getTasksInCategory()', function () {

        it('gets all tasks within the given category', sinon.test(function () {
            const category = factories.existingTask().category;
            const findStub = this.stub(Task, 'find').returnsPromise();

            Task.getTasksInCategory(category);

            expect(findStub)
                .to.be.calledWithExactly({ category });
        }));
    });

    describe('removeOne()', function () {

        it('removes a task', sinon.test(function () {
            const _id = factories.existingTask()._id;
            const findOneAndRemoveStub = this.stub(Task, 'findOneAndRemove').returnsPromise();

            Task.removeOne(_id);

            expect(findOneAndRemoveStub)
                .to.be.calledWithExactly({ _id });
        }));
    });

    describe('editNameAndDescription()', function () {

        it('edits the name and description of a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, name, description } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();

            Task.editNameAndDescription(_id, name, description);

            expect(updateStub)
                .to.be.calledWithExactly(
                { _id },
                { $set: { name, description } }
                );
        }));
    });

    describe('editClaims()', function () {

        it('updates the claims of a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, claims } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();

            Task.editClaims(_id, claims);

            expect(updateStub)
                .to.be.calledWithExactly(
                { _id },
                { $set: { claims } }
                );
        }));
    });

    describe('addSubmission()', function () {

        it('adds a submission to a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, submissions } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();

            Task.addSubmission(_id, submissions);

            expect(updateStub)
                .to.be.calledWithExactly(
                { _id },
                { $set: { submissions } }
                );
        }));
    });

    describe('deleteSubmission()', function () {

        it('deletes a submission from a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, submissions } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();

            Task.addSubmission(_id, submissions);

            expect(updateStub)
                .to.be.calledWithExactly(
                { _id },
                { $set: { submissions } }
                );
        }));
    });

    describe('setArchive()', function () {

        it('toggles the archived state of a task', sinon.test(function () {
            const updatedTask = factories.updatedTask();
            const { _id, archive } = updatedTask;
            const updateStub = this.stub(Task, 'update').returnsPromise();

            Task.setArchive(_id, archive);

            expect(updateStub)
                .to.be.calledWithExactly(
                { _id },
                { $set: { archive } }
                );
        }));
    });

    describe('getAllSubmissions()', function () {

        it('gets all tasks that have a submission', sinon.test(function () {
            const findStub = this.stub(Task, 'find').returnsPromise();

            Task.getAllSubmissions();

            expect(findStub)
                .to.be.calledWithExactly(
                {
                    submissions: { $gt: [] }
                }
                );
        }));
    });

    describe('getCategory()', function () {

        it('get a category', sinon.test(function () {
            const { category } = factories.existingTask();
            const findOneStub = this.stub(Task, 'findOne').returnsPromise();

            Task.getCategory(category);

            expect(findOneStub)
                .to.be.calledWithExactly(
                {
                    name: category,
                    category: true
                }
                );
        }));
    });

    describe('removeCategory()', function () {

        it('delete a category', sinon.test(function () {
            const { category } = factories.existingTask();
            const findOneAndRemoveStub = this.stub(Task, 'findOneAndRemove').returnsPromise();

            Task.removeCategory(category);

            expect(findOneAndRemoveStub)
                .to.be.calledWithExactly(
                {
                    name: category,
                    category: true
                }
                );
        }));
    });

    describe('removeAllInCategory()', function () {

        it('remove all tasks within a category', sinon.test(function () {
            const { category } = factories.existingTask();
            const removeStub = this.stub(Task, 'remove').returnsPromise();

            Task.removeAllInCategory(category);

            expect(removeStub)
                .to.be.calledWithExactly({ category });
        }));
    });

});