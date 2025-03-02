import express from "express";
import { isAuthenticated } from "../middlewares";
import { updateSchedule, getSchedule } from "../controllers/schedule";

export default (router: express.Router) => {
    router.post('/schedule', isAuthenticated, updateSchedule);
    router.get('/schedule', isAuthenticated, getSchedule);
}; 