import { expect } from 'chai';

import * as factories from './factories';
import submissionList from '../submissionList';

describe('submissionList()', function () {

    let tasks, submissions;

    beforeEach(function () {

        tasks = [
            factories.existingTask(),
            factories.existingTask()
        ];

        tasks[0].submissions = [
            {
                date: new Date().getTime() - 3000,
                username: 'testUser',
                url: 'google.com'
            },
            {
                date: new Date().getTime() - 1000,
                username: 'testUser2',
                url: 'google.com'
            }
        ];

        tasks[1].submissions = [
            {
                date: new Date().getTime() - 2000,
                username: 'testUser',
                url: 'google.com'
            },
            {
                date: new Date().getTime(),
                username: 'testUser2',
                url: 'google.com'
            }
        ];

        submissions = submissionList(tasks);
    });

    it('Return an array of submissions from the given tasks', function () {
        expect(submissions)
            .to.be.an('array');
        expect(submissions[0])
            .to.be.an('object')
            .that.has.all.keys('date', 'username', 'url', 'name', 'category', 'archive');
    });

    it('Should be ordered from newest to oldest', function () {
        for (let i = 0; i < submissions.length - 1; i++) {
            expect(submissions[i].date)
                .to.be.at.least(submissions[i + 1].date);
        }
    });
});