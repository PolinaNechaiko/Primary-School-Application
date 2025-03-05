import { API } from '../index';

export interface SubjectData {
    name: string;
    description: string;
    coverImage: string;
    time: string[];
}

export interface Subject extends SubjectData {
    _id: string;
    code: string;
    tasks: {
        name: string;
        descriptions: string;
    }[];
}

export const createSubject = async (subjectData: SubjectData) => {
    try {
        console.log('Creating subject with data:', subjectData);
        const response = await API.post('/create-subject', subjectData);
        console.log('Response from createSubject:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating subject:', error);
        throw error;
    }
};

export const getSubjects = async () => {
    try {
        const response = await API.get('/subjects');
        console.log('API response for subjects:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error;
    }
};

export const getSubjectByName = async (name: string) => {
    try {
        const response = await API.post('/subject', { name });
        return response.data;
    } catch (error) {
        console.error('Error fetching subject:', error);
        throw error;
    }
};

export const getSubjectsByTeacher = async (teacherId: string) => {
    try {
        console.log('Fetching subjects for teacher with ID:', teacherId);
        const response = await API.get(`/subjects/teacher/${teacherId}`);
        console.log('Response from getSubjectsByTeacher:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching teacher subjects:', error);
        throw error;
    }
};

export const getSubjectById = async (subjectId: string) => {
    try {
        const response = await API.get(`/subject/${subjectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subject:', error);
        throw error;
    }
};

export const getStudentSubjects = async (studentId: string) => {
    try {
        const response = await API.get(`/subjects/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student subjects:', error);
        throw error;
    }
}; 