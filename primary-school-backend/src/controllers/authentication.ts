import express from "express";
import {allowedRoles, createUser, getUserByEmail, getUserById, updateUser} from "../db/users";
import {authentication, random} from "../helpers";
import {getSubjectByCode} from "../db/subjects";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({ message: "Invalid password" });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        // Отримуємо повну інформацію про користувача з популяцією предметів
        const userWithSubjects = await getUserById(user._id.toString()).populate('subjects');

        return res.status(200).json({ 
            authentication: { sessionToken: user.authentication.sessionToken },
            user: userWithSubjects
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error during login" });
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username,role} = req.body;

        if (!email || !password || !username || !role) return res.sendStatus(400);

        const existingUser = await getUserByEmail(email);

        if (existingUser) return res.sendStatus(400);

        if (!allowedRoles.includes(role)) {
            return res.status(400).send("Invalid role");
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            role,
            authentication: {
                salt,
                password : authentication(salt, password),
            },
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const joinSubject = async (req: express.Request, res: express.Response) => {
    try {
        const { subjectCode } = req.body;
        const userId = req.identity._id;

        if (!subjectCode) {
            return res.status(400).json({ message: "Subject code is required" });
        }

        // Перевіряємо чи існує предмет з таким кодом
        const subject = await getSubjectByCode(subjectCode);
        if (!subject) {
            return res.status(404).json({ message: "Invalid subject code" });
        }

        // Отримуємо поточного користувача
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Оновлюємо користувача
        const updatedUser = await updateUser(userId, {
            isJoinedToSubject: true,
            subjects: user.subjects ? [...user.subjects, subject._id] : [subject._id]
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error joining subject" });
    }
}

export const getCurrentUser = async (req: express.Request, res: express.Response) => {
    try {
        const userId = req.identity._id;
        
        // Отримуємо користувача з бази даних з інформацією про предмети
        const user = await getUserById(userId).populate('subjects');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error getting current user" });
    }
}

// Add schedelue class
// Add Electronik card