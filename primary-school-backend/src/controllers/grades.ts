import express from 'express';
import { GradeModel } from '../models/grade';

// Виставлення оцінки
export const setGrade = async (req: express.Request, res: express.Response) => {
    try {
        const { studentId, taskId, subjectId, grade } = req.body;
        const teacherId = req.identity._id;

        // Перевірка, чи існує вже оцінка
        const existingGrade = await GradeModel.findOne({
            student: studentId,
            task: taskId,
            subject: subjectId
        });

        if (existingGrade) {
            // Оновлення існуючої оцінки
            existingGrade.grade = grade;
            await existingGrade.save();
            return res.status(200).json(existingGrade);
        }

        // Створення нової оцінки
        const newGrade = new GradeModel({
            student: studentId,
            task: taskId,
            subject: subjectId,
            grade,
            createdBy: teacherId
        });

        await newGrade.save();

        return res.status(201).json(newGrade);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при виставленні оцінки" });
    }
};

// Отримання оцінок для журналу
export const getGradesForJournal = async (req: express.Request, res: express.Response) => {
    try {
        const { subjectId } = req.params;
        
        const grades = await GradeModel.find({ subject: subjectId })
            .populate('student', 'username')
            .populate('task', 'name')
            .sort({ createdAt: -1 });
        
        // Перетворюємо масив оцінок у формат, зручний для фронтенду
        const formattedGrades: Record<string, Record<string, number>> = {};
        
        grades.forEach(grade => {
            if (!formattedGrades[grade.student._id]) {
                formattedGrades[grade.student._id] = {};
            }
            formattedGrades[grade.student._id][grade.task._id] = grade.value;
        });
        
        return res.status(200).json(formattedGrades);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні оцінок" });
    }
}; 