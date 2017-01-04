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
		let taskSubmissions = task.submissions.map(submission => {
			return {
				...submission,
				name: task.name,
				category: task.category,
				archive: task.archive
			};
		});
		// Flatten array of submissions and combine with submissionList
		submissionList = [...submissionList, ...taskSubmissions];
	});
	// Order submissions from newest to oldest
	submissionList.sort((a, b) => b.date - a.date);

	return submissionList;
}