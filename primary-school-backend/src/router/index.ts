import express from "express";
import authentication from "./authentication";
import users from "./users";
import subjects from "./subjects";
import students from "./students";
import {isAuthenticated} from "../middlewares";
import {joinSubject} from "../controllers/authentication";
import schedule from "./schedule";

const router = express.Router();

export default ():  express.Router => {
    authentication(router);
    users(router);
    subjects(router);
    students(router);
    schedule(router);
    // Додаємо новий маршрут
    router.post('/join-subject', isAuthenticated, joinSubject);
    
    return router;
}