import express from "express";
import { isAuthenticated, isTeacher } from "../middlewares";
import { addGrade, getGrades, getGradesForJournal, getStudentGrades } from "../controllers/grades";

export default (router: express.Router) => {
    router.post('/grades', isAuthenticated, isTeacher, addGrade);
    router.get('/grades', isAuthenticated, getGrades);
    router.get('/grades/subject/:subjectId', isAuthenticated, getGradesForJournal);
    router.get('/grades/student/:studentId', isAuthenticated, getStudentGrades);
}; 