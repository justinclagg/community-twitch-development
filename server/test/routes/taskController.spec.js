const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);
chai.use(sinonChai);
chai.should();

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

        let statusSpy, sendSpy, getAsyncStub, setAsyncStub;
        let request, response;

        beforeEach(function () {
            request = factories.request();
            response = factories.response();
            statusSpy = sinon.spy(response, 'status');
            sendSpy = sinon.spy(response, 'send');
            getAsyncStub = sinon.stub(redisClient, 'getAsync').returnsPromise();
            setAsyncStub = sinon.stub(redisClient, 'setAsync').returnsPromise();
        });

        afterEach(function () {
            statusSpy.restore();
            sendSpy.restore();
            getAsyncStub.restore();
            setAsyncStub.restore();
        });

        it('should get cached tasks from a category if available', function () {
            const cachedTasks = JSON.stringify([factories.existingTask()]);
            getAsyncStub.resolves(cachedTasks);

            taskController.getAllInCategory()(request, response);

            statusSpy.should.be.calledOnce.calledWithExactly(200);
            sendSpy.should.be.calledOnce.calledWithExactly(JSON.parse(cachedTasks));
        });

        it('gets tasks from database and caches if no cache found', function () {
            const existingTask = factories.existingTask();
            getAsyncStub.resolves();
            const getTasksInCategoryStub = sinon.stub(Task, 'getTasksInCategory').returnsPromise();
            getTasksInCategoryStub.resolves([existingTask]);

            taskController.getAllInCategory()(request, response);

            getTasksInCategoryStub.should.be.calledOnce.calledWithExactly(request.params.category);
            setAsyncStub.should.be.calledWithExactly(request.params.category, JSON.stringify([existingTask]));
            statusSpy.should.be.calledOnce.calledWithExactly(200);
            sendSpy.should.be.calledOnce.calledWithExactly([existingTask]);
        });

        it('should handle errors and send a response', function () {
            const testError = new Error('test');
            getAsyncStub.rejects(testError.message);

            taskController.getAllInCategory()(request, response);

            statusSpy.should.be.calledOnce.calledWithExactly(500);
            sendSpy.should.be.calledOnce.calledWithExactly(`Error getting tasks - ${testError.message}`);
        });

    });

    describe('add()', function () {

        let createStub, statusSpy, sendSpy, cacheTasksStub;
        let request, response;

        beforeEach(function () {
            request = factories.request();
            response = factories.response();
            statusSpy = sinon.spy(response, 'status');
            sendSpy = sinon.spy(response, 'send');
            createStub = sinon.stub(Task, 'createAndSave').returnsPromise();
        });

        afterEach(function () {
            createStub.restore();
            statusSpy.restore();
            sendSpy.restore();
        });

        after(function () {
            cacheTasksStub.restore();
        });

        it('should save a new task and cache tasks', function () {
            const existingTask = factories.existingTask();
            createStub.resolves(existingTask);
            cacheTasksStub = sinon.stub(cache, 'tasks');

            taskController.add()(request, response);

            statusSpy.should.be.calledOnce.calledWithExactly(201);
            sendSpy.should.be.calledOnce.calledWithExactly(existingTask);
            cacheTasksStub.should.be.calledOnce;
        });

        it('should handle errors and send a response', function () {
            const testError = new Error('test');
            createStub.rejects(testError.message);

            taskController.add()(request, response);
            
            statusSpy.should.be.calledOnce.calledWithExactly(500);
            sendSpy.should.be.calledOnce.calledWithExactly(`Error posting task - ${testError.message}`);
        });

    });
});