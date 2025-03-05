import express from 'express';
import { ScheduleModel } from '../models/schedule';
import { getUserById } from '../db/users';

// Створення або оновлення розкладу
export const updateSchedule = async (req: express.Request, res: express.Response) => {
    try {
        const { items } = req.body;
        const teacherId = req.identity._id;
        
        // Перевіряємо, чи є користувач вчителем
        const user = await getUserById(teacherId);
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({ message: "Тільки вчителі можуть оновлювати розклад" });
        }

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
        const userId = req.identity._id;
        
        // Отримуємо інформацію про користувача
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "Користувача не знайдено" });
        }
        
        let schedule;
        
        if (user.role === 'teacher') {
            // Якщо користувач - вчитель, отримуємо його розклад
            schedule = await ScheduleModel.findOne({ teacher: userId })
                .populate('items.subject', 'name');
                
            // Якщо розклад не знайдено, повертаємо порожній об'єкт з порожнім масивом items
            if (!schedule) {
                console.log(`Розклад для вчителя ${userId} не знайдено, повертаємо порожній об'єкт`);
                return res.status(200).json({ items: [] });
            }
        } else {
            // Якщо користувач - студент, отримуємо розклад для всіх предметів, до яких він приєднався
            // Знаходимо всіх вчителів, які ведуть предмети, до яких приєднався студент
            const schedules = await ScheduleModel.find()
                .populate({
                    path: 'items.subject',
                    select: 'name students',
                    match: { students: userId }
                });
            
            // Фільтруємо елементи розкладу, залишаючи тільки ті, що стосуються предметів студента
            const filteredSchedules = schedules.map(schedule => {
                const filteredItems = schedule.items.filter(item => 
                    item.subject && (item.subject as any).students && 
                    (item.subject as any).students.includes(userId)
                );
                
                return {
                    ...schedule.toObject(),
                    items: filteredItems
                };
            });
            
            // Об'єднуємо всі елементи розкладу в один об'єкт
            schedule = {
                items: filteredSchedules.flatMap(s => s.items)
            };
            
            // Якщо немає елементів розкладу для студента, повертаємо порожній масив
            if (!schedule.items || schedule.items.length === 0) {
                console.log(`Розклад для студента ${userId} не знайдено, повертаємо порожній об'єкт`);
                return res.status(200).json({ items: [] });
            }
        }
        
        return res.status(200).json(schedule);
    } catch (error) {
        console.log('Помилка при отриманні розкладу:', error);
        return res.status(400).json({ message: "Помилка при отриманні розкладу" });
    }
}; 