import express from 'express';
import { getStudents, addStudent } from '../controllers/students';
import { isAuthenticated, isTeacher } from '../middlewares';

export default (router: express.Router) => {
    router.get('/students', isAuthenticated, isTeacher, getStudents);
    router.post('/students', isAuthenticated, isTeacher, addStudent);
}; 