import express from "express";
import { isAuthenticated } from "../middlewares";
import { setGrade, getGradesForJournal } from "../controllers/grades";

export default (router: express.Router) => {
    router.post('/grades', isAuthenticated, setGrade);
    router.get('/grades/subject/:subjectId', isAuthenticated, getGradesForJournal);
}; 