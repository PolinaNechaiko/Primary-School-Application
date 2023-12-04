import express from "express";
import {isAuthenticated} from "../middlewares";
import {getAllSubjectsList, getAllSubjectTask, getSubject} from "../controllers/subjects";

export default (router: express.Router) => {
    router.post('/subject', isAuthenticated, getSubject);
    router.get('/subjects', isAuthenticated, getAllSubjectsList);
    router.get('/tasks', isAuthenticated, getAllSubjectTask);

};