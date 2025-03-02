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

export const getAllSubjects = async () => {
    try {
        const response = await API.get('/subjects');
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