import { expect } from 'chai';
import parseJSON from '../parseJSON';

describe('parseJSON()', function() {
	it('Parse the response body to a JSON format', function() {
		// This doesn't properly test the Fetch API Response object
		const bodyObj = { testData: 'test'};
		const bodyStr = JSON.stringify(bodyObj);
		const response = {
			body: bodyStr,
			json: function() {
				return JSON.parse(this.body);
			}
		};
		expect(parseJSON(response)).to.deep.equal(bodyObj);
	});
});