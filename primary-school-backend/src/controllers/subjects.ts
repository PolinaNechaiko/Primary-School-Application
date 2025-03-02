import express from "express";
import {
    getAllSubjects,
    getSubjectByName,
    getSubjectTaskById,
    SubjectsModel,
    generateUniqueCode
} from "../db/subjects";

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
            tasks: [] // Початково предмет не має завдань
        });

        await newSubject.save();

        return res.status(201).json(newSubject);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Помилка при створенні предмету" });
    }
};
