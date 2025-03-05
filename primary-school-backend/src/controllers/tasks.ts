import express from 'express';
import { TaskModel } from '../models/task';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Створення нового завдання
export const createTask = async (req: express.Request, res: express.Response) => {
    try {
        const { name, description, content, subjectId } = req.body;

        if (!name || !description || !subjectId) {
            return res.status(400).json({ message: "Всі поля є обов'язковими" });
        }

        const newTask = new TaskModel({
            name,
            description,
            content,
            subjectId
        });

        await newTask.save();

        return res.status(201).json({
            message: "Завдання успішно створено",
            task: newTask
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при створенні завдання" });
    }
};

// Отримання завдань за предметом
export const getTasksBySubject = async (req: express.Request, res: express.Response) => {
    try {
        const { subjectId } = req.params;

        if (!subjectId) {
            return res.status(400).json({ message: "ID предмета є обов'язковим" });
        }

        const tasks = await TaskModel.find({ subjectId });

        return res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Помилка при отриманні завдань" });
    }
};

export const submitTask = async (req: Request, res: Response) => {
  try {
    const { taskId, subjectId, studentId, response } = req.body;

    if (!taskId || !subjectId || !studentId || !response) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if task exists
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if subject exists
    const subject = await mongoose.model('Subject').findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Define CompletedTask model if it doesn't exist
    let CompletedTaskModel;
    try {
      CompletedTaskModel = mongoose.model('CompletedTask');
    } catch (error) {
      // If model doesn't exist, create it
      const completedTaskSchema = new mongoose.Schema({
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        response: { type: String, required: true },
        completedAt: { type: Date, default: Date.now }
      });
      
      CompletedTaskModel = mongoose.model('CompletedTask', completedTaskSchema);
    }

    // Check if task is already completed by this student
    const existingCompletion = await CompletedTaskModel.findOne({
      taskId,
      studentId,
      subjectId
    });

    if (existingCompletion) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Create a new completed task record
    const completedTask = new CompletedTaskModel({
      taskId,
      subjectId,
      studentId,
      response,
      completedAt: new Date()
    });

    await completedTask.save();

    return res.status(201).json({
      message: 'Task submitted successfully',
      completedTask
    });
  } catch (error) {
    console.error('Error submitting task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCompletedTasks = async (req: Request, res: Response) => {
  try {
    const { studentId, subjectId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const query: any = { studentId };
    
    if (subjectId) {
      query.subjectId = subjectId;
    }

    // Get CompletedTask model
    const CompletedTaskModel = mongoose.model('CompletedTask');
    const completedTasks = await CompletedTaskModel.find(query);
    
    return res.status(200).json(completedTasks);
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 