import chai from 'chai';
import validUrl from '../validUrl';
chai.should();

describe('validUrl()', function () {
    it('Return the URL if valid', function () {
        const validUrls = [
            'https://www.google.com',
            'http://www.google.com',
            'http://google.com',
            'https://google.com'
        ];
        validUrls.forEach(url => {
            validUrl(url).should.equal(url);
        });
        // Add HTTP protocol if missing
        const missingProtocol = [
            'google.com',
            'www.google.com'
        ];

        missingProtocol.forEach(url => {
            validUrl(url).should.equal('http://' + url);
        });
    });

    it('Return false for invalid URL', function () {
        const invalidUrls = [
            'googlecom',
            'google@com',
            'google/com',
            'google.com@test'
        ];
        
        invalidUrls.forEach(url => {
            validUrl(url).should.be.false;
        });
    });
});