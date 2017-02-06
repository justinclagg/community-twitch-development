const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon); // Promise stubs run synchronously for testing
chai.use(sinonChai);

const User = require('../../models/User.js');
const factories = require('../factories.js');

describe('User model', function () {

    describe('model validation', function () {

        it('_id is required', function (done) {
            const userProps = factories.newUser();
            const userWithoutId = new User({ ...userProps, _id: null });

            userWithoutId.validate(err => {
                expect(err).to.exist;
                done();
            });
        });

        it('username is required', function (done) {
            const userProps = factories.newUser();
            const userWithoutUsername = new User({ ...userProps, username: null });

            userWithoutUsername.validate(err => {
                expect(err).to.exist;
                done();
            });
        });

        it('email is required', function (done) {
            const userProps = factories.newUser();
            const userWithoutEmail = new User({ ...userProps, email: null });

            userWithoutEmail.validate(err => {
                expect(err).to.exist;
                done();
            });
        });

        it('role is required', function (done) {
            const userProps = factories.newUser();
            const userWithoutRole = new User({ ...userProps, role: null });

            userWithoutRole.validate(err => {
                expect(err).to.exist;
                done();
            });
        });
    });

    describe('getUser()', function () {

        it('returns a user profile', sinon.test(function () {
            const { _id } = factories.newUser();
            const findOneStub = this.stub(User, 'findOne').returnsPromise();

            User.getUser(_id);

            expect(findOneStub).to.be.calledWithExactly({ _id });
        }));
    });

    describe('createAndSave()', function () {

        it('creates and saves a new user with the given properties', sinon.test(function () {
            const userProps = factories.newUser();
            const createStub = this.stub(User, 'create').returnsPromise();

            User.createAndSave(userProps);

            expect(createStub).to.be.calledWithExactly(userProps);
        }));
    });

    describe('unlinkGitlab()', function () {

        it('removes the gitlab id from a user profile', sinon.test(function () {
            const userProps = factories.newUser();
            const updatedProps = { ...userProps, gitlabId: '' };
            const user = new User(userProps);
            const saveStub = this.stub(user, 'save').returnsPromise();

            user.unlinkGitlab();

            expect(saveStub).to.be.calledOnce;
            expect(user.toObject()).to.deep.equal(updatedProps);
        }));
    });

    describe('linkGitlab()', function () {

        it('adds a gitlab id to a user profile', sinon.test(function () {
            const userProps = { ...factories.newUser(), gitlabId: '' };
            const updatedProps = factories.newUser();
            const user = new User(userProps);
            const saveStub = this.stub(user, 'save').returnsPromise();

            user.linkGitlab(updatedProps.gitlabId);

            expect(saveStub).to.be.calledOnce;
            expect(user.toObject()).to.deep.equal(updatedProps);
        }));
    });

    describe('updateRole()', function () {

        it('changes the user role to the one given', sinon.test(function () {
            const userProps = factories.newUser();
            const updatedProps = { ...userProps, role: 'subscriber' };
            const user = new User(userProps);
            const saveStub = this.stub(user, 'save').returnsPromise();

            user.updateRole(updatedProps.role);

            expect(saveStub).to.be.calledOnce;
            expect(user.toObject()).to.deep.equal(updatedProps);
        }));
    });

});