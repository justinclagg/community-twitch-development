/**
 * Check if user has an appropriate access level to see page's content
 * 
 * @param {object} profile - User profile
 * @param {string} role - Minimum required access level to see content
 * @returns {boolean}
 */

export default function userHasAccess(profile, role) {
    if (profile.role === role) {
        return true;
    }
    else if (role === 'subscriber' && profile.role === 'admin') {
        return true;
    }
    else if (role === 'member' && (profile.role === 'subscriber' || profile.role === 'admin')) {
        return true;
    }
    else {
        return false;
    }
}