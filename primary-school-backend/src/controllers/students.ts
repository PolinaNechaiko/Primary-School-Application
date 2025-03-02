import express from 'express';
import { createUser, getUsersByRole, getUserByEmail } from '../db/users';
import { random, authentication } from '../helpers';

export const getStudents = async (req: express.Request, res: express.Response) => {
    try {
        const students = await getUsersByRole('student');
        if (!students) {
            return res.status(404).json({ message: "No students found" });
        }
        return res.status(200).json(students);
    } catch (error) {
        console.error('Error in getStudents controller:', error);
        return res.status(500).json({ 
            message: "Error getting students",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const addStudent = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Перевіряємо, чи існує користувач з таким email
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Генеруємо сіль та тимчасовий пароль
        const salt = random();
        const temporaryPassword = random();
        
        // Хешуємо пароль
        const hashedPassword = authentication(salt, temporaryPassword);

        const student = await createUser({
            email,
            username: name,
            authentication: {
                salt,
                password: hashedPassword,
            },
            role: 'student'
        });

        // Видаляємо конфіденційні дані перед відправкою відповіді
        const studentResponse = {
            _id: student._id,
            email: student.email,
            username: student.username,
            role: student.role,
            temporaryPassword // Додаємо тимчасовий пароль до відповіді
        };

        return res.status(201).json(studentResponse);
    } catch (error) {
        console.error('Error in addStudent:', error);
        return res.status(400).json({ 
            message: "Error creating student",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}; 