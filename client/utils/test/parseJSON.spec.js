import { expect } from 'chai';
import sinon from 'sinon';

import parseJSON from '../parseJSON';

describe('parseJSON()', function () {

    it('should call the json() method of the response object', sinon.test(function () {
        const response = {
            json: this.spy()
        };

        parseJSON(response);

        expect(response.json)
            .to.be.calledOnce;
    }));
});