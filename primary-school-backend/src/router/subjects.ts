import express from "express";
import {isAuthenticated} from "../middlewares";
import {
    createNewTask, 
    getAllSubjectsList, 
    getAllSubjectTask, 
    getSubject, 
    createSubject,
    getSubjectsByTeacher,
    getSubjectById,
    getStudentSubjects
} from "../controllers/subjects";

const subjects = (router: express.Router) => {
    router.post('/subject', isAuthenticated, getSubject);
    router.get('/subjects', isAuthenticated, getAllSubjectsList);
    router.get('/tasks', isAuthenticated, getAllSubjectTask);
    router.post('/new-task', isAuthenticated, createNewTask);
    router.post('/create-subject', isAuthenticated, createSubject);
    router.get('/subjects/teacher/:teacherId', isAuthenticated, getSubjectsByTeacher);
    router.get('/subject/:subjectId', isAuthenticated, getSubjectById);
    router.get('/subjects/student/:studentId', isAuthenticated, getStudentSubjects);
};

export default subjects;