import { API } from '../index';

export interface WeeklyGameData {
    title: string;
    description: string;
    gameUrl: string;
}

export interface WeeklyGame extends WeeklyGameData {
    _id: string;
    createdBy: {
        _id: string;
        username: string;
    };
    createdAt: string;
    active: boolean;
}

export const createWeeklyGame = async (gameData: WeeklyGameData) => {
    try {
        const response = await API.post('/weekly-game', gameData);
        return response.data;
    } catch (error) {
        console.error('Error creating weekly game:', error);
        throw error;
    }
};

export const getCurrentWeeklyGame = async () => {
    try {
        const response = await API.get('/weekly-game/current');
        return response.data;
    } catch (error) {
        console.error('Error fetching current weekly game:', error);
        throw error;
    }
};

export const getAllWeeklyGames = async () => {
    try {
        const response = await API.get('/weekly-game/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all weekly games:', error);
        throw error;
    }
}; 