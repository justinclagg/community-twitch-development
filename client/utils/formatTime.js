/**
 * Formats the local time or date for a given Date instance
 * 
 * @param {object} date - Date instance
 * @returns {string}
 */

export function getLocalTime(date) {
    let period = 'am';
    let minutes = pad(date.getMinutes());
    let hours = date.getHours();
    if (hours >= 12) {
        period = 'pm';
        if (hours > 12) hours -= 12;
    }
    else if (hours == 0) {
        hours = 12;
    }
    return `${hours}:${minutes} ${period}`;
}

export function getLocalDate(date) {
    let month = date.getMonth();
    let day = date.getDate();
    return `${month} / ${day}`;
}

function pad(num) {
    const paddedNum = (num < 10) ? '0' + num : num;
    return paddedNum;
}