import express from 'express';
import { TaskModel } from '../models/task';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CompletedTaskModel } from '../models/completedTask';
import { GradeModel } from '../models/grade';

// Створення нового завдання
export const createTask = async (req: express.Request, res: express.Response) => {
    try {
        const { name, description, subjectId, attachments } = req.body;
        const userId = req.identity._id;

        console.log('Received task data:', { name, description, subjectId, attachments: attachments?.length || 0 });

        if (!name || !description || !subjectId) {
            return res.status(400).json({ message: "Всі поля є обов'язковими" });
        }

        // Створюємо об'єкт для нового завдання
        const taskData: any = {
            name,
            description,
            subject: subjectId,
            createdBy: userId,
        };

        // Додаємо вкладення, якщо вони є
        if (attachments && Array.isArray(attachments) && attachments.length > 0) {
            console.log('Adding attachments to task:', attachments.length);
            taskData.attachments = attachments;
        }

        const newTask = new TaskModel(taskData);
        await newTask.save();

        console.log('Created new task with ID:', newTask._id);
        
        return res.status(201).json({
            message: "Завдання успішно створено",
            task: newTask
        });
    } catch (error) {
        console.error('Error creating task:', error);
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

        console.log('Getting tasks for subject with ID:', subjectId);
        const tasks = await TaskModel.find({ subject: subjectId });
        console.log('Found tasks:', tasks);

        return res.status(200).json(tasks);
    } catch (error) {
        console.log('Error getting tasks:', error);
        return res.status(400).json({ message: "Помилка при отриманні завдань" });
    }
};

// Отримання завдання за ID
export const getTaskById = async (req: express.Request, res: express.Response) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ message: "ID завдання є обов'язковим" });
        }

        console.log('Getting task with ID:', taskId);
        const task = await TaskModel.findById(taskId);
        
        if (!task) {
            return res.status(404).json({ message: "Завдання не знайдено" });
        }
        
        console.log('Found task:', task);

        return res.status(200).json(task);
    } catch (error) {
        console.error('Error getting task:', error);
        return res.status(400).json({ message: "Помилка при отриманні завдання" });
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
    const completedTasks = await CompletedTaskModel.find(query);
    
    return res.status(200).json(completedTasks);
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Отримання відповідей учнів на конкретне завдання (для вчителя)
export const getTaskResponses = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
    
    console.log('Getting responses for task ID:', taskId);
    
    // Перевірка, чи існує завдання
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Отримання всіх відповідей на це завдання з даними учнів
    const responses = await CompletedTaskModel.find({ taskId })
      .populate({
        path: 'studentId',
        select: 'username firstName lastName email'
      })
      .sort({ completedAt: -1 });
      
    console.log(`Found ${responses.length} responses for task ID: ${taskId}`);
    
    return res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching task responses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Оновлення відгуку та оцінки для виконаного завдання (для вчителя)
export const updateTaskFeedback = async (req: Request, res: Response) => {
  try {
    const { completedTaskId } = req.params;
    const { feedback, grade } = req.body;
    
    if (!completedTaskId) {
      return res.status(400).json({ message: 'Completed task ID is required' });
    }
    
    console.log('Updating feedback for completed task ID:', completedTaskId);
    
    // Перевірка, чи існує виконане завдання
    const completedTask = await CompletedTaskModel.findById(completedTaskId);
    if (!completedTask) {
      return res.status(404).json({ message: 'Completed task not found' });
    }
    
    // Оновлення відгуку та оцінки
    completedTask.feedback = feedback;
    completedTask.grade = grade;
    await completedTask.save();
    
    console.log('Updated feedback for completed task:', completedTaskId);
    
    // Синхронізація з журналом оцінок
    if (grade) {
      try {
        console.log('Synchronizing grade with gradebook');
        const teacherId = req.identity._id;
        
        // Перевірка, чи існує вже оцінка в журналі
        const existingGrade = await GradeModel.findOne({
          student: completedTask.studentId,
          task: completedTask.taskId,
          subject: completedTask.subjectId
        });
        
        if (existingGrade) {
          // Оновлення існуючої оцінки
          existingGrade.grade = grade;
          await existingGrade.save();
          console.log('Updated existing grade in gradebook');
        } else {
          // Створення нової оцінки в журналі
          const newGrade = new GradeModel({
            student: completedTask.studentId,
            task: completedTask.taskId,
            subject: completedTask.subjectId,
            grade,
            createdBy: teacherId
          });
          
          await newGrade.save();
          console.log('Created new grade in gradebook');
        }
      } catch (gradeError) {
        console.error('Error synchronizing with gradebook:', gradeError);
        // Не перериваємо виконання у випадку помилки при синхронізації з журналом
      }
    }
    
    return res.status(200).json({
      message: 'Feedback updated successfully',
      completedTask
    });
  } catch (error) {
    console.error('Error updating task feedback:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 