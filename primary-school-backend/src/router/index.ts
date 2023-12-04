import express from "express";
import authentication from "./authentication";
import users from "./users";
import subjects from "./subjects";
const router = express.Router();

export default ():  express.Router => {
    authentication(router);
    users(router);
    subjects(router);
    return router;
}