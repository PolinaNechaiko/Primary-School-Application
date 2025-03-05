import express from "express";
import {
    getAllSubjects,
    getSubjectByName,
    getSubjectTaskById,
    SubjectsModel,
    generateUniqueCode
} from "../db/subjects";
import mongoose from "mongoose";

export const getSubject = async (req: express.Request, res: express.Response) => {
    try {
        const { name } = req.body;
        const users = await getSubjectByName(name);

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllSubjectsList = async (req: express.Request, res: express.Response) => {
    try {

        const subjects = await getAllSubjects();

        return res.status(200).json(subjects);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllSubjectTask = async (req: express.Request, res: express.Response) => {
    try {
        const subjectId = String(req.query.subjectId);

        const subject = await getSubjectTaskById(subjectId);

        return res.status(200).json(subject.tasks);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createNewTask = async (req: express.Request, res: express.Response) => {
    try {
        const { subjectId, name, description } = req.body;

        if (!subjectId || !name || !description) {
            // Check if the necessary data is present
            return res.status(400).send("Incomplete task data");
        }

        const subject = await SubjectsModel.findById(subjectId);

        if (!subject) {
            // Subject not found
            return res.status(404).send("Subject not found");
        }

        // Construct the task object
        const taskData = { name, descriptions:description };

        // Add the new task to the tasks array of the subject
        subject.tasks.push(taskData);

        // Save the updated subject document
        await subject.save();

        return res.status(200).json(subject).end();
    } catch (error) {
        console.error(error);
        return res.sendStatus(500); // Internal Server Error
    }
};

export const createSubject = async (req: express.Request, res: express.Response) => {
    try {
        const { name, description, coverImage, time } = req.body;
        const userId = req.identity._id;

        if (!name || !description || !coverImage || !time) {
            return res.status(400).json({ message: "Усі поля є обов'язковими" });
        }

        // Перевіряємо чи існує предмет з таким ім'ям
        const existingSubjectByName = await getSubjectByName(name);
        if (existingSubjectByName) {
            return res.status(400).json({ message: "Предмет з такою назвою вже існує" });
        }

        // Генеруємо унікальний код
        const code = await generateUniqueCode();

        // Створюємо новий предмет
        const newSubject = new SubjectsModel({
            name,
            description,
            coverImage,
            code,
            time,
            createdBy: userId, // Додаємо ID вчителя, який створив предмет
            tasks: [] // Початково предмет не має завдань
        });

        await newSubject.save();

        return res.status(201).json(newSubject);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Помилка при створенні предмету" });
    }
};

export const getSubjectsByTeacher = async (req: express.Request, res: express.Response) => {
    try {
        const { teacherId } = req.params;
        
        // Перевіряємо, чи передано ID вчителя
        if (!teacherId) {
            return res.status(400).json({ message: "ID вчителя є обов'язковим" });
        }
        
        // Шукаємо предмети, створені вчителем
        console.log('Finding subjects with createdBy:', teacherId);
        
        // Спочатку перевіримо, чи є взагалі предмети в базі даних
        const allSubjects = await SubjectsModel.find();
        console.log('Total subjects in database:', allSubjects.length);
        
        // Тепер шукаємо предмети, створені вчителем
        const subjects = await SubjectsModel.find({ createdBy: teacherId })
            .populate('students', 'username')
            .sort({ createdAt: -1 });
        
        console.log(`Знайдено ${subjects.length} предметів для вчителя ${teacherId}`);
        
        // Якщо предметів не знайдено, повертаємо порожній масив
        if (!subjects || subjects.length === 0) {
            console.log(`Предметів для вчителя ${teacherId} не знайдено`);
            return res.status(200).json([]);
        }
        
        return res.status(200).json(subjects);
    } catch (error) {
        console.log('Помилка при отриманні предметів вчителя:', error);
        return res.status(400).json({ message: "Помилка при отриманні предметів" });
    }
};

export const getSubjectById = async (req: express.Request, res: express.Response) => {
    try {
        const { subjectId } = req.params;
        
        const subject = await SubjectsModel.findById(subjectId)
            .populate('students', 'username');
        
        if (!subject) {
            return res.status(404).json({ message: "Предмет не знайдено" });
        }
        
        return res.status(200).json(subject);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні предмету" });
    }
};

export const getSubjects = async (req: express.Request, res: express.Response) => {
    try {
        // Отримуємо всі предмети
        const subjects = await SubjectsModel.find()
            .select('_id name description coverImage code time')
            .sort({ name: 1 });
        
        console.log(`Знайдено ${subjects.length} предметів`);
        
        return res.status(200).json(subjects);
    } catch (error) {
        console.error('Error getting subjects:', error);
        return res.status(500).json({ 
            message: "Error getting subjects",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get subjects for a specific student
export const getStudentSubjects = async (req: express.Request, res: express.Response) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ message: "ID студента є обов'язковим" });
        }

        // Find the student
        const student = await mongoose.model('User').findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Студента не знайдено" });
        }

        // Get subjects that the student has joined using the students field
        const subjects = await SubjectsModel.find({ students: studentId });

        // If no subjects found, try to get them from the user's subjects array
        if (!subjects || subjects.length === 0) {
            if (student.subjects && student.subjects.length > 0) {
                const subjectsFromUser = await SubjectsModel.find({
                    _id: { $in: student.subjects }
                });
                return res.status(200).json(subjectsFromUser);
            }
        }

        return res.status(200).json(subjects);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні предметів студента" });
    }
};
