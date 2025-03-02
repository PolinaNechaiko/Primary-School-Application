import express from "express";
import { isAuthenticated } from "../middlewares";
import { createTask, getTasksBySubject } from "../controllers/tasks";

export default (router: express.Router) => {
    router.post('/tasks', isAuthenticated, createTask);
    router.get('/tasks/subject/:subjectId', isAuthenticated, getTasksBySubject);
}; 