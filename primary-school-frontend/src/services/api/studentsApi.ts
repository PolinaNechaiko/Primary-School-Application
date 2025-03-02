import { API } from '../index';

export const getStudentsList = async () => {
    try {
        const response = await API.get('/students');
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

export const addStudent = async (studentData: { name: string; email: string }) => {
    try {
        const response = await API.post('/students', studentData);
        return response.data;
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}; 