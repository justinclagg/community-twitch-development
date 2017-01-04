import { expect } from 'chai';
import validUrl from '../../client/utils/validUrl';

describe('Validate inputed URLs', function() {
	it('Return the URL if valid', function() {
		const validUrls = [
			'https://www.google.com',
			'http://www.google.com',
			'http://google.com',
			'https://google.com'
		];
		validUrls.forEach(url => {
			expect(validUrl(url)).to.equal(url);
		});
		// Add HTTP protocol if missing
		const missingProtocol = [
			'google.com',
			'www.google.com'
		];
		missingProtocol.forEach(url => {
			expect(validUrl(url)).to.equal('http://' + url);
		});
	});
	it('Return false for invalid URL', function() {
		const invalidUrls = [
			'googlecom',
			'google@com',
			'google/com',
			'google.com@test'
		];
		invalidUrls.forEach(url => {
			expect(validUrl(url)).to.be.false;
		});
	});
});