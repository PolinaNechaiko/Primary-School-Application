import { API } from '../index';

export const setGrade = async (gradeData: any) => {
    try {
        const response = await API.post('/grades', gradeData);
        return response.data;
    } catch (error) {
        console.error('Error setting grade:', error);
        throw error;
    }
};

export const getGradesForJournal = async (subjectId: string) => {
    try {
        const response = await API.get(`/grades/subject/${subjectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching grades:', error);
        throw error;
    }
};

export const addGrade = async (gradeData: { 
    student: string; 
    subject: string; 
    task: string; 
    value: number 
}) => {
    try {
        const response = await API.post('/grades', gradeData);
        return response.data;
    } catch (error) {
        console.error('Error adding grade:', error);
        throw error;
    }
}; 