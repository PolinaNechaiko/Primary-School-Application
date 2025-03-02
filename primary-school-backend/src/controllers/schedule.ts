import express from 'express';
import { ScheduleModel } from '../models/schedule';

// Створення або оновлення розкладу
export const updateSchedule = async (req: express.Request, res: express.Response) => {
    try {
        const { items } = req.body;
        const teacherId = req.identity._id;

        // Перевірка, чи існує вже розклад
        let schedule = await ScheduleModel.findOne({ teacher: teacherId });

        if (schedule) {
            // Оновлення існуючого розкладу
            schedule.items = items;
            schedule.updatedAt = new Date();
            await schedule.save();
        } else {
            // Створення нового розкладу
            schedule = new ScheduleModel({
                teacher: teacherId,
                items
            });
            await schedule.save();
        }

        return res.status(200).json(schedule);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при оновленні розкладу" });
    }
};

// Отримання розкладу
export const getSchedule = async (req: express.Request, res: express.Response) => {
    try {
        const teacherId = req.identity._id;
        
        const schedule = await ScheduleModel.findOne({ teacher: teacherId })
            .populate('items.subject', 'name');
        
        if (!schedule) {
            return res.status(404).json({ message: "Розклад не знайдено" });
        }
        
        return res.status(200).json(schedule);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні розкладу" });
    }
}; 