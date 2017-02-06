export const userRoles = () => {
    return ['admin', 'subscriber', 'member'];
};

export const profile = () => {
    return {
        _id: '1',
        username: 'username',
        email: 'email',
        role: 'role',
        gitlabId: '2'
    };
};

export const existingTask = () => {
    return {
        _id: '1',
        category: 'Test Category',
        name: 'name',
        description: 'description',
        claims: ['claim'],
        submissions: [],
        archive: false
    };
};