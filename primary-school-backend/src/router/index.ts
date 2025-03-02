import express from "express";
import authentication from "./authentication";
import users from "./users";
import subjects from "./subjects";
import {isAuthenticated} from "../middlewares";
import {joinSubject} from "../controllers/authentication";

const router = express.Router();

export default ():  express.Router => {
    authentication(router);
    users(router);
    subjects(router);
    
    // Додаємо новий маршрут
    router.post('/join-subject', isAuthenticated, joinSubject);
    
    return router;
}