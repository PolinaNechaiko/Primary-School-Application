import { API } from '../index';

export const createTask = async (taskData: any) => {
    try {
        const response = await API.post('/tasks', taskData);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export const getTasksBySubject = async (subjectId: string) => {
    try {
        const response = await API.get(`/tasks/subject/${subjectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}; 