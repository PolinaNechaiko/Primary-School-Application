import express from 'express';
import { createUser, getUsersByRole, getUserByEmail } from '../db/users';
import { random, authentication } from '../helpers';
import { SubjectsModel } from '../models/subjects';
import { UserModel } from '../db/users';

export const getStudents = async (req: express.Request, res: express.Response) => {
    try {
        // Отримуємо ID та роль поточного користувача
        const userId = req.identity?._id;
        const userRole = req.identity?.role;
        
        console.log(`Get students request from user ${userId} with role ${userRole}`);
        
        // Для вчителів показуємо як учнів, записаних на їхні предмети, так і тих, яких вони створили
        if (userRole === 'teacher') {
            // Створюємо масив для зберігання ID всіх студентів, яких повинен бачити вчитель
            const allStudentIdsToShow = new Set<string>();
            
            // 1. Знаходимо всі предмети цього вчителя
            console.log('Finding subjects for teacher:', userId);
            const teacherSubjects = await SubjectsModel.find({ createdBy: userId });
            console.log(`Found ${teacherSubjects.length} subjects for teacher`);
            
            // 2. Збираємо унікальні ID всіх студентів з усіх предметів вчителя
            if (teacherSubjects && teacherSubjects.length > 0) {
                teacherSubjects.forEach(subject => {
                    if (subject.students && subject.students.length > 0) {
                        subject.students.forEach(studentId => {
                            allStudentIdsToShow.add(studentId.toString());
                        });
                    }
                });
            }
            
            console.log(`Found ${allStudentIdsToShow.size} unique students across teacher's subjects`);
            
            // 3. Знаходимо учнів, створених цим вчителем
            const createdStudents = await UserModel.find({ 
                role: 'student', 
                createdBy: userId 
            }).select('_id');
            
            console.log(`Found ${createdStudents.length} students created by this teacher`);
            
            // Додаємо їх до загального списку
            createdStudents.forEach(student => {
                allStudentIdsToShow.add(student._id.toString());
            });
            
            // 4. Отримуємо дані тільки про студентів із предметів вчителя та створених ним
            const studentIdsArray = Array.from(allStudentIdsToShow);
            
            if (studentIdsArray.length > 0) {
                const students = await getUsersByRole('student', studentIdsArray);
                console.log(`Returning ${students.length} students to teacher`);
                return res.status(200).json(students);
            }
            
            console.log('No students found for this teacher, returning empty array');
            return res.status(200).json([]);
        } else {
            // Для інших ролей (або якщо роль не визначена) повертаємо всіх студентів
            const students = await getUsersByRole('student');
            
            if (!students || students.length === 0) {
                console.log('No students found');
                return res.status(200).json([]);
            }
            
            console.log(`Returning all ${students.length} students`);
            return res.status(200).json(students);
        }
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
        const { firstName, lastName, email } = req.body;
        const teacherId = req.identity._id; // ID вчителя, який створює учня

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: "First name, last name, and email are required" });
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

        // Створюємо повне ім'я з імені та прізвища
        const fullName = `${firstName} ${lastName}`;

        const student = await createUser({
            email,
            username: fullName,
            authentication: {
                salt,
                password: hashedPassword,
            },
            role: 'student',
            createdBy: teacherId, // Зберігаємо ID вчителя, який створив цього учня
        });

        console.log(`Teacher ${teacherId} created student ${student._id}`);

        // Видаляємо конфіденційні дані перед відправкою відповіді
        const studentResponse = {
            _id: student._id,
            firstName,
            lastName,
            email: student.email,
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