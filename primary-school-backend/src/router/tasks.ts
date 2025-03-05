import express from "express";
import { isAuthenticated } from "../middlewares";
import { createTask, getTasksBySubject, submitTask, getCompletedTasks } from "../controllers/tasks";

const tasks = (router: express.Router) => {
    router.post('/tasks', isAuthenticated, createTask);
    router.get('/tasks/subject/:subjectId', isAuthenticated, getTasksBySubject);
    router.post('/tasks/submit', isAuthenticated, submitTask);
    router.get('/tasks/completed', isAuthenticated, getCompletedTasks);
};

export default tasks; 