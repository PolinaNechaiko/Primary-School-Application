import { API } from '../index';
import { ITaskCreate } from '../../interfaces/Task';

export const createTask = async (taskData: ITaskCreate) => {
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
        console.error('Error getting tasks by subject:', error);
        throw error;
    }
};

// Отримання інформації про конкретне завдання
export const getTaskById = async (taskId: string) => {
    try {
        const response = await API.get(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting task details:', error);
        throw error;
    }
};

// Отримання відповідей на завдання
export const getTaskResponses = async (taskId: string) => {
    try {
        const response = await API.get(`/tasks/responses/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting task responses:', error);
        throw error;
    }
};

// Оновлення відгуку та оцінки для виконаного завдання
export const updateTaskFeedback = async (completedTaskId: string, feedback: string, grade: string) => {
    try {
        const response = await API.put(`/tasks/feedback/${completedTaskId}`, { feedback, grade });
        return response.data;
    } catch (error) {
        console.error('Error updating task feedback:', error);
        throw error;
    }
}; 