export const category = 'Test Category';

export const categories = ['Test Category', 'Category 2', 'Category 3'];

export const newTask = () => {
    return {
        category: 'Test Category',
        name: 'name',
        description: 'description',
        claims: [],
        submissions: [],
        archive: false
    };
};

export const existingTask = () => {
    return {
        _id: '1',
        category: 'Test Category',
        name: 'name',
        description: 'description',
        claims: [],
        submissions: [],
        archive: false
    };
};

export const otherTask = () => {
    return {
        _id: '2',
        category: 'Other Category',
        name: 'other name',
        description: 'other description',
        claims: ['claim 1'],
        submissions: [{
            date: new Date(),
            username: 'username',
            url: 'justinclagg.com'
        }],
        archive: true
    };
};

export const defaultState = () => {
    return {
        tasks: [],
        submissions: [],
        fetchingTasks: false,
        fetchingSubmissions: false,
        error: null
    };
};

export const router = () => {
    return {
        push: () => { }
    };
};

export const socket = () => {
    return {
        emit: () => { }
    };
};