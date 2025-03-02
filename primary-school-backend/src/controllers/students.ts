import express from 'express';
import { createUser, getUsersByRole } from '../db/users';
import { random } from '../helpers';

export const getStudents = async (req: express.Request, res: express.Response) => {
    try {
        const students = await getUsersByRole('student');
        return res.status(200).json(students);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error getting students" });
    }
};

export const addStudent = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Генеруємо тимчасовий пароль
        const temporaryPassword = random();

        const student = await createUser({
            email,
            username: name,
            authentication: {
                password: temporaryPassword,
            },
            role: 'student'
        });

        // TODO: Відправити email з тимчасовим паролем

        return res.status(201).json(student);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error creating student" });
    }
}; 