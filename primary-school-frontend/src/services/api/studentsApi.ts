import { API } from '../index';

export interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    grade?: string;
    subjects?: string[];
}

export interface StudentCreateData {
    firstName: string;
    lastName: string;
    email?: string;
    grade?: string;
}

export const getStudentsList = async (): Promise<Student[]> => {
    try {
        const response = await API.get('/students');
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

export const addStudent = async (studentData: StudentCreateData): Promise<Student> => {
    try {
        const response = await API.post('/students', studentData);
        return response.data;
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}; 