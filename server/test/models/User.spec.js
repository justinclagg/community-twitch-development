const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon); // Promise stubs run synchronously for testing
chai.use(sinonChai);
chai.should();

const User = require('../../models/User.js');
const factories = require('../factories.js');

describe('User model', function () {

    describe('model validation', function () {
        it('_id is required', function (done) {
            const userProps = factories.newUser();
            const userWithoutId = new User({ ...userProps, _id: null });

            userWithoutId.validate(err => {
                err.should.exist;
                done();
            });
        });

        it('username is required', function (done) {
            const userProps = factories.newUser();
            const userWithoutUsername = new User({ ...userProps, username: null });

            userWithoutUsername.validate(err => {
                err.should.exist;
                done();
            });
        });

        it('email is required', function (done) {
            const userProps = factories.newUser();
            const userWithoutEmail = new User({ ...userProps, email: null });

            userWithoutEmail.validate(err => {
                err.should.exist;
                done();
            });
        });
        
        it('role is required', function (done) {
            const userProps = factories.newUser();
            const userWithoutRole = new User({ ...userProps, role: null });

            userWithoutRole.validate(err => {
                err.should.exist;
                done();
            });
        });
    });

});