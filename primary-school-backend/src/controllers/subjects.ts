import express from "express";
import {getAllSubjects, getSubjectByName, getSubjectTaskById} from "../db/subjects";

export const getSubject = async (req: express.Request, res: express.Response) => {
    try {
        const { name } = req.body;
        const users = await getSubjectByName(name);

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllSubjectsList = async (req: express.Request, res: express.Response) => {
    try {

        const subjects = await getAllSubjects();

        return res.status(200).json(subjects);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllSubjectTask = async (req: express.Request, res: express.Response) => {
    try {
        const taskId = String(req.query.taskId);

        const subject = await getSubjectTaskById(taskId);

        return res.status(200).json(subject.tasks);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};