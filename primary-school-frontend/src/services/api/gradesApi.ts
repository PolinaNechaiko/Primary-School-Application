import { API } from '../index';

export interface GradeData {
    studentId: string;
    subjectId: string;
    taskId: string;
    grade: string;
}

export interface Grade {
    _id: string;
    student: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    subject: {
        _id: string;
        name: string;
    };
    task: {
        _id: string;
        name: string;
    };
    grade: string;
    createdAt: string;
    updatedAt: string;
}

export const setGrade = async (gradeData: GradeData) => {
    try {
        const response = await API.post('/grades', gradeData);
        return response.data;
    } catch (error) {
        console.error('Error setting grade:', error);
        throw error;
    }
};

export const getGrades = async () => {
    try {
        const response = await API.get('/grades');
        return response.data;
    } catch (error) {
        console.error('Error fetching all grades:', error);
        throw error;
    }
};

export const getGradesForJournal = async (subjectId: string) => {
    try {
        const response = await API.get(`/grades/subject/${subjectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching grades for subject:', error);
        throw error;
    }
};

export const getStudentGrades = async (studentId: string) => {
    try {
        const response = await API.get(`/grades/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student grades:', error);
        throw error;
    }
};

// Alias for backward compatibility
export const addGrade = setGrade; 