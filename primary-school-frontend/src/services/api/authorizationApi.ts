import {API} from "../index.ts";


export const loginUser = async (data: any) => {
    try {
        const response = await API.post(
            'auth/login',
            data,
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

export const registerUser = async (
    data: any,
) => {
    try {
        const response = await API.post(
            'auth/register',
            data,
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

export const getGeneratedLink = async (url: string) => {
    try {
        const response = await API.get(
            'api/authorization/generate-link',
            {
                params: {
                    url: url,
                },
            },
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
