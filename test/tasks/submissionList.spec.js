import { expect } from 'chai';
import submissionList from '../../client/utils/submissionList';

describe('submissionList()', function () {
	let tasks = [
		{
			name: 'testName',
			category: 'testCategory',
			archive: false,
			submissions: [
				{
					date: new Date().getTime() - 3000,
					username: 'testUser',
					url: 'google.com'
				},
				{
					date: new Date().getTime() - 1000,
					username: 'testUser2',
					url: 'google.com'
				},
			]
		},
		{
			name: 'testName',
			category: 'testCategory',
			archive: false,
			submissions: [
				{
					date: new Date().getTime() - 2000,
					username: 'testUser',
					url: 'google.com'
				},
				{
					date: new Date().getTime(),
					username: 'testUser2',
					url: 'google.com'
				},
			]
		}
	];

	const submissions = submissionList(tasks);

	it('Return an array of submissions from the given tasks', function () {
		expect(submissions).to.be.an('array');
		expect(submissions[0]).to.be.an('object')
			.that.has.all.keys('date', 'username', 'url', 'name', 'category', 'archive');
	});

	it('Should be ordered from newest to oldest', function () {
		for (let i = 0; i < submissions.length - 1; i++) {
			expect(submissions[i].date >= submissions[i + 1].date);
		}
	});
});