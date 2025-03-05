import express from 'express';
import { WeeklyGameModel } from '../models/weeklyGame';

// Створення нової гри тижня
export const createWeeklyGame = async (req: express.Request, res: express.Response) => {
    try {
        const { title, description, gameUrl } = req.body;
        const userId = req.identity._id;

        // Деактивуємо всі попередні активні ігри
        await WeeklyGameModel.updateMany(
            { active: true },
            { active: false }
        );

        // Створюємо нову гру
        const newGame = new WeeklyGameModel({
            title,
            description,
            gameUrl,
            createdBy: userId
        });

        await newGame.save();

        return res.status(201).json(newGame);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при створенні гри тижня" });
    }
};

// Отримання поточної гри тижня
export const getCurrentWeeklyGame = async (req: express.Request, res: express.Response) => {
    try {
        const currentGame = await WeeklyGameModel.findOne({ active: true })
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        
        if (!currentGame) {
            return res.status(404).json({ message: "Активна гра тижня не знайдена" });
        }
        
        return res.status(200).json(currentGame);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні гри тижня" });
    }
};

// Отримання всіх ігор тижня
export const getAllWeeklyGames = async (req: express.Request, res: express.Response) => {
    try {
        const games = await WeeklyGameModel.find()
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        
        return res.status(200).json(games);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні ігор тижня" });
    }
}; 