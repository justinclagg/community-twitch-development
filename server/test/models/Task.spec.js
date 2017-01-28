const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
require('sinon-as-promised');

const Task = require('../../models/Task.js');
const factories = require('../factories.js');

describe('Task model', function () {

    describe('createAndSave()', function () {

        let createStub;

        beforeEach(function () {
            createStub = sinon.stub(Task, 'create');
        });

        afterEach(function () {
            createStub.restore();
        });

        it('saves a new task and returns the saved task', function () {
            const newTask = factories.newTask();
            const existingTask = factories.existingTask();
            createStub.resolves(existingTask);

            Task.createAndSave(newTask)
                .then(task => {
                    expect(task).to.deep.equal(existingTask);
                    expect(createStub).to.be.calledWithExactly(newTask);
                });
        });
    });

    describe('getTasksInCategory()', function () {

        let findStub;

        beforeEach(function () {
            findStub = sinon.stub(Task, 'find');
        });

        afterEach(function () {
            findStub.restore();
        });

        it('gets all tasks within the given category', function () {
            const category = factories.existingTask().category;
            findStub.resolves([]);

            Task.getTasksInCategory(category)
                .then(tasks => {
                    expect(tasks).to.be.an('array');
                    expect(findStub).to.be.calledWithExactly({ category });
                });
        });
    });





});