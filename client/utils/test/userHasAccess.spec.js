import chai from 'chai';
import userHasAccess from '../userHasAccess';
chai.should();

const roles = ['admin', 'subscriber', 'member'];

describe('userHasAccess()', function () {
    it('Users have access to their level and lower', function () {
        roles.forEach(role => {
            userHasAccess({ role: 'admin' }, role).should.be.true;
        });
        userHasAccess({ role: 'subscriber' }, 'subscriber').should.be.true;
        userHasAccess({ role: 'subscriber' }, 'member').should.be.true;
        userHasAccess({ role: 'member' }, 'member').should.be.true;
    });
    it('Users can\'t access above their level', function () {
        userHasAccess({ role: 'subscriber' }, 'admin').should.be.false;
        userHasAccess({ role: 'member' }, 'subscriber').should.be.false;
        userHasAccess({ role: 'member' }, 'admin').should.be.false;
    });
});