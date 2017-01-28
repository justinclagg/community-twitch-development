/**
 * Tests if a given url is valid. Returns the url or false
 * 
 * @param {string} url
 * @returns {string|boolean}
 */

export default function validUrl(url) {
    if (/^http/i.test(url) === false) {
        // Add protocol if missing
        url = 'http://' + url;
    }

    if (/^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/.test(url)) {
        // Valid url
        return url;
    }
    else {
        // Invalid url
        return false;
    }
}