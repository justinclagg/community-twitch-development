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