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
        const response = await API.post('/create-subject', subjectData);
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
        const response = await API.get(`/subjects/teacher/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching teacher subjects:', error);
        throw error;
    }
};

export const getSubjectById = async (subjectId: string) => {
    try {
        const response = await API.get(`/subjects/${subjectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subject:', error);
        throw error;
    }
}; 