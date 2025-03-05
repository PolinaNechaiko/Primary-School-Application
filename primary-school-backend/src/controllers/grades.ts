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

// Додавання оцінки (аліас для setGrade для сумісності з API)
export const addGrade = setGrade;

// Отримання всіх оцінок
export const getGrades = async (req: express.Request, res: express.Response) => {
    try {
        const grades = await GradeModel.find()
            .populate('student', 'username')
            .populate('task', 'name')
            .populate('subject', 'name')
            .sort({ createdAt: -1 });
        
        return res.status(200).json(grades);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні оцінок" });
    }
};

// Отримання оцінок для журналу
export const getGradesForJournal = async (req: express.Request, res: express.Response) => {
    try {
        const { subjectId } = req.params;
        
        const grades = await GradeModel.find({ subject: subjectId })
            .populate('student', 'username firstName lastName')
            .populate('task', 'name')
            .sort({ createdAt: -1 });
        
        // Перетворюємо масив оцінок у формат, зручний для фронтенду
        const formattedGrades: Record<string, Record<string, string>> = {};
        
        grades.forEach(grade => {
            const studentId = grade.student._id.toString();
            const taskId = grade.task._id.toString();
            
            if (!formattedGrades[studentId]) {
                formattedGrades[studentId] = {};
            }
            
            formattedGrades[studentId][taskId] = grade.grade;
        });
        
        return res.status(200).json(formattedGrades);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні оцінок" });
    }
};

// Отримання оцінок для конкретного учня
export const getStudentGrades = async (req: express.Request, res: express.Response) => {
    try {
        const { studentId } = req.params;
        
        const grades = await GradeModel.find({ student: studentId })
            .populate({
                path: 'task',
                select: 'name description'
            })
            .populate({
                path: 'subject',
                select: 'name description'
            })
            .sort({ createdAt: -1 });
        
        return res.status(200).json(grades);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні оцінок учня" });
    }
}; 