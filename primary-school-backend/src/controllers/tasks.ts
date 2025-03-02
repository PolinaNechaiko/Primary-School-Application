import express from 'express';
import { TaskModel } from '../models/task';

// Створення нового завдання
export const createTask = async (req: express.Request, res: express.Response) => {
    try {
        const { name, description, content, subjectId } = req.body;
        const userId = req.identity._id;

        const newTask = new TaskModel({
            name,
            description,
            content,
            subject: subjectId,
            createdBy: userId
        });

        await newTask.save();

        return res.status(201).json(newTask);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при створенні завдання" });
    }
};

// Отримання завдань для предмету
export const getTasksBySubject = async (req: express.Request, res: express.Response) => {
    try {
        const { subjectId } = req.params;
        
        const tasks = await TaskModel.find({ subject: subjectId })
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        
        return res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні завдань" });
    }
}; 