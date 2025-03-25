import express from "express";
import { isAuthenticated, isTeacher } from "../middlewares";
import { 
    createTask, 
    getTasksBySubject,
    getTaskById,
    submitTask, 
    getCompletedTasks,
    getTaskResponses,
    updateTaskFeedback
} from "../controllers/tasks";

const tasks = (router: express.Router) => {
    router.post('/tasks', isAuthenticated, isTeacher, createTask);
    router.get('/tasks/subject/:subjectId', isAuthenticated, getTasksBySubject);
    router.get('/tasks/completed', isAuthenticated, getCompletedTasks);
    router.get('/tasks/responses/:taskId', isAuthenticated, isTeacher, getTaskResponses);
    router.get('/tasks/:taskId', isAuthenticated, getTaskById);
    router.post('/tasks/submit', isAuthenticated, submitTask);
    router.put('/tasks/feedback/:completedTaskId', isAuthenticated, isTeacher, updateTaskFeedback);
};

export default tasks; 