import express from 'express';
import { isAuthenticated, isTeacher } from '../middlewares';
import { createWeeklyGame, getCurrentWeeklyGame, getAllWeeklyGames } from '../controllers/weeklyGame';

export default (router: express.Router) => {
    // Створення нової гри тижня (тільки для вчителів)
    router.post('/weekly-game', isAuthenticated, isTeacher, createWeeklyGame);
    
    // Отримання поточної гри тижня
    router.get('/weekly-game/current', isAuthenticated, getCurrentWeeklyGame);
    
    // Отримання всіх ігор тижня
    router.get('/weekly-game/all', isAuthenticated, getAllWeeklyGames);
}; 