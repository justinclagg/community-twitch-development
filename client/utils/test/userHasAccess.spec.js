import { expect } from 'chai';
import userHasAccess from '../userHasAccess';

const roles = ['admin', 'subscriber', 'member'];

describe('userHasAccess()', function() {
	it('Users have access to their level and lower', function() {
		roles.forEach(role => {
			expect(userHasAccess({ role: 'admin' }, role)).to.be.true;
		});
		expect(userHasAccess({ role: 'subscriber' }, 'subscriber')).to.be.true;		
		expect(userHasAccess({ role: 'subscriber' }, 'member')).to.be.true;		
		expect(userHasAccess({ role: 'member' }, 'member')).to.be.true;		
	});
	it('Users can\'t access above their level', function() {
		expect(userHasAccess({ role: 'subscriber' }, 'admin')).to.be.false;
		expect(userHasAccess({ role: 'member' }, 'subscriber')).to.be.false;
		expect(userHasAccess({ role: 'member' }, 'admin')).to.be.false;
	});
});