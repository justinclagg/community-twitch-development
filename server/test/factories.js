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
    return { ...newTask(), _id: '1' };
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
    request,
    response
};