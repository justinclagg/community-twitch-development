/**
 * Create an array of submissions for the given tasks, ordered from newest to oldest
 * 
 * @param {array} tasks - All tasks with a submission
 * @returns {array} submissionList
 */

export default function submissionList(tasks) {
    let submissionList = [];

    tasks.forEach(task => {
        // Add the task name, category, and archive status to each submission
        // then add it to the submissionList
        task.submissions.map(submission => {
            submissionList.push({
                ...submission,
                name: task.name,
                category: task.category,
                archive: task.archive
            });
        });
    });
    // Order submissions from newest to oldest
    submissionList.sort((a, b) => b.date - a.date);

    return submissionList;
}