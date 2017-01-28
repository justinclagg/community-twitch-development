// Formats enviroment variables set by Heroku config variables

module.exports = function parseHerokuEnv() {
    const lowercaseStrings = ['TWITCH_STREAMER', 'GITLAB_ACCESS_LEVEL'];
    const lowercaseArrays = ['ADDITIONAL_ADMINS', 'ADDITIONAL_SUBSCRIBERS'];
    // Convert case sensitive variables to lowercase
    lowercaseStrings.forEach(key => {
        process.env[key] = process.env[key].toLowerCase();
    });
    // Convert comma separated lists to a lowercase array
    lowercaseArrays.forEach(key => {
        if (process.env[key].indexOf(',') !== -1) {
            process.env[key] = process.env[key].replace(/\s+/g, '').toLowerCase().split(',');
        }
        else {
            process.env[key] = process.env[key].toLowerCase();
        }
    });
};