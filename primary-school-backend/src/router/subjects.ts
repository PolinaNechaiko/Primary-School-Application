import express from "express";
import {isAuthenticated} from "../middlewares";
import {createNewTask, getAllSubjectsList, getAllSubjectTask, getSubject} from "../controllers/subjects";

export default (router: express.Router) => {
    router.post('/subject', isAuthenticated, getSubject);
    router.get('/subjects', isAuthenticated, getAllSubjectsList);
    router.get('/tasks', isAuthenticated, getAllSubjectTask);
    router.post('/new-task', isAuthenticated, createNewTask);
};