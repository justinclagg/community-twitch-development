/**
 * Formats environment variables added by dotenv
 * Modified from dotenv-parsed-variables (https://github.com/niftylettuce/dotenv-parse-variables)
 * 
 * @param {object} env - Output from dotenv, containing environment variables declared in .env
 */

function parseDotenv(env) {
	Object.keys(env).forEach(key => {
		process.env[key] = parseKey(key, env[key]);
	});
}

function parseKey(key, value) {
	const lowercaseStrings = ['TWITCH_STREAMER', 'GITLAB_ACCESS_LEVEL'];
	const lowercaseArrays = ['ADDITIONAL_ADMINS', 'ADDITIONAL_SUBSCRIBERS'];

	if (lowercaseStrings.indexOf(key) !== -1) {
		// Case sensitive variables
		return value.toLowerCase();
	}
	else if (lowercaseArrays.indexOf(key) !== -1) {
		// Case sensitive arrays
		return value.replace(/\s+/g, '').toLowerCase().split(',');
	}
	else if (value.indexOf(',') !== -1) {
		// Case insensitive arrays
		return value.replace(/\s+/g, '').split(',');
	}
	else {
		return value;
	}
}

module.exports = {
	parseDotenv,
	parseKey
};