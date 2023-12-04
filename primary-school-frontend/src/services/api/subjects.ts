import {API} from "../index.ts";

export const getSubjectsList = async () => {
    try {
        const response = await API.get(
            '/subjects',
        );
        return response.data;
    } catch (error) {
        console.error(
            'An error occurred while fetching data: ',
            error,
        );
        throw error;
    }
};

export const getTasksList = async (taskId:string) => {
    try {
        const response = await API.get(
            `/tasks?taskId=${taskId}`,
        );
        return response.data;
    } catch (error) {
        console.error(
            'An error occurred while fetching data: ',
            error,
        );
        throw error;
    }
};