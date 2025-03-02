import { API } from '../index';

export const updateSchedule = async (scheduleData: any) => {
    try {
        const response = await API.post('/schedule', scheduleData);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
};

export const getSchedule = async () => {
    try {
        const response = await API.get('/schedule');
        return response.data;
    } catch (error) {
        console.error('Error fetching schedule:', error);
        throw error;
    }
}; 