import express from 'express';
import { getStudents, addStudent } from '../controllers/students';
import { isAuthenticated, isTeacher } from '../middlewares';

const students = (router: express.Router) => {
    // Дозволяємо доступ до списку студентів для всіх аутентифікованих користувачів
    router.get('/students', isAuthenticated, getStudents);
    
    // Додавання студентів доступне тільки для вчителів
    router.post('/students', isAuthenticated, isTeacher, addStudent);
};

export default students; 