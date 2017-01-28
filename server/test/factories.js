function newTask() {
    return {
        category: 'Test category',
        name: 'name',
        description: 'description',
        claims: [],
        submissions: [],
        archive: false
    };
}

function existingTask() {
    return {
        _id: '1',
        category: 'Test category',
        name: 'name',
        description: 'description',
        claims: [],
        submissions: [],
        archive: false
    };
}

function newUser() {
    return {
        _id: '1',
        username: 'userName',
        email: 'email@email.com',
        role: 'role',
        gitlabId: '2',
    };
}

function updatedTask() {
    return {
        _id: '1',
        category: 'Test category',
        name: 'updated name',
        description: 'updated description',
        claims: ['user'],
        submissions: [{}],
        archive: true
    };
}

function request() {
    return {
        body: newTask,
        params: {
            category: newTask.category
        }
    };
}

function response() {
    return {
        status: function () {
            return this;
        },
        send: function () { }
    };
}

module.exports = {
    newTask,
    existingTask,
    updatedTask,
    newUser,
    request,
    response
};