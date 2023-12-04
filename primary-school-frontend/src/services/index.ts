import axios, {AxiosInstance} from 'axios';
import {getApiUrl} from '../utils/options/apiUrl.ts';

export const API = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
});
export const configureInterceptorsForProject = (
    instance: AxiosInstance,
): void => {
    instance.interceptors.request.use(
        async (config) => {
            config.headers['Accept'] = 'application/json';

            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );
};
