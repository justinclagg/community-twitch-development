const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);
chai.use(sinonChai);

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const redis = require('redis-mock');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();
sinon.stub(require('redis'), 'createClient').returns(redisClient);

const Task = require('../../models/Task.js');
const cache = require('../../utils/cache.js');
const factories = require('../factories.js');
const taskController = require('../../routes/task/taskController.js');

describe('Task Routes', function () {

    describe('getAllInCategory()', function () {

        let status, send, getAsync, setAsync;
        let request, response;

        beforeEach(function () {
            request = factories.request();
            response = factories.response();
            status = sinon.spy(response, 'status');
            send = sinon.spy(response, 'send');
            getAsync = sinon.stub(redisClient, 'getAsync').returnsPromise();
            setAsync = sinon.stub(redisClient, 'setAsync').returnsPromise();
        });

        afterEach(function () {
            status.restore();
            send.restore();
            getAsync.restore();
            setAsync.restore();
        });

        it('should get cached tasks from a category if available', function () {
            const cachedTasks = JSON.stringify([factories.existingTask()]);
            getAsync.resolves(cachedTasks);

            taskController.getAllInCategory()(request, response);

            expect(status)
                .to.be.calledOnce
                .calledWithExactly(200);
            expect(send)
                .to.be.calledOnce
                .calledWithExactly(JSON.parse(cachedTasks));
        });

        it('gets tasks from database and caches if no cache found', function () {
            const existingTask = factories.existingTask();
            const getTasksInCategory = sinon.stub(Task, 'getTasksInCategory').returnsPromise();
            getTasksInCategory.resolves([existingTask]);
            getAsync.resolves();

            taskController.getAllInCategory()(request, response);

            expect(getTasksInCategory)
                .to.be.calledOnce
                .calledWithExactly(request.params.category);
            expect(setAsync)
                .to.be.calledOnce
                .calledWithExactly(request.params.category, JSON.stringify([existingTask]));
            expect(status)
                .to.be.calledOnce
                .calledWithExactly(200);
            expect(send)
                .to.be.calledOnce
                .calledWithExactly([existingTask]);
        });

        it('should handle errors and send a response', function () {
            const err = new Error('test');
            getAsync.rejects(err.message);

            taskController.getAllInCategory()(request, response);

            expect(status)
                .to.be.calledOnce
                .calledWithExactly(500);
            expect(send)
                .to.be.calledOnce
                .calledWithExactly(`Error getting tasks - ${err.message}`);
        });

    });

    describe('add()', function () {

        let createAndSave, status, send, cacheTasks;
        let request, response;

        before(function () {
            cacheTasks = sinon.stub(cache, 'tasks');
        });
        
        beforeEach(function () {
            request = factories.request();
            response = factories.response();
            status = sinon.spy(response, 'status');
            send = sinon.spy(response, 'send');
            createAndSave = sinon.stub(Task, 'createAndSave').returnsPromise();
        });

        afterEach(function () {
            createAndSave.restore();
            status.restore();
            send.restore();
        });

        after(function () {
            cacheTasks.restore();
        });

        it('should save a new task and cache tasks', function () {
            const existingTask = factories.existingTask();
            createAndSave.resolves(existingTask);

            taskController.add()(request, response);

            expect(status)
                .to.be.calledOnce
                .calledWithExactly(201);
            expect(send)
                .to.be.calledOnce
                .calledWithExactly(existingTask);
            expect(cacheTasks)
                .to.be.calledOnce;
        });

        it('should handle errors and send a response', function () {
            const err = new Error('test');
            createAndSave.rejects(err.message);

            taskController.add()(request, response);

            expect(status)
                .to.be.calledOnce
                .calledWithExactly(500);
            expect(send)
                .to.be.calledOnce
                .calledWithExactly(`Error posting task - ${err.message}`);
        });

    });
});