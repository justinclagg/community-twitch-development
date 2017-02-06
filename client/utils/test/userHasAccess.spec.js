import { expect } from 'chai';

import * as factories from './factories';
import userHasAccess from '../userHasAccess';

describe('userHasAccess()', function () {

    it('Users have access to their level and lower', function () {
        const userRoles = factories.userRoles();

        userRoles.forEach((role, i) => {
            let user = { role };
            for (let k = i; k < userRoles.length; k++) { // Test the current user role and those after
                expect(
                    userHasAccess(user, userRoles[k])
                ).to.be.true;
            }
        });
    });

    it('Users can\'t access above their level', function () {
        const userRoles = factories.userRoles().reverse(); // Reverse role order to test lowest level roles first

        userRoles.forEach((role, i) => {
            let user = { role };
            for (let k = i + 1; k < userRoles.length; k++) { // Test roles after the current user role
                expect(
                    userHasAccess(user, userRoles[k])
                ).to.be.false;
            }
        });
    });
});