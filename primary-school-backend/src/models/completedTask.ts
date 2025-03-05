import mongoose from 'mongoose';

const CompletedTaskSchema = new mongoose.Schema({
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true 
  },
  subjectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject', 
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  response: { 
    type: String, 
    required: true 
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  },
  feedback: {
    type: String,
    default: null
  },
  grade: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Create a compound index to ensure a student can only submit a task once
CompletedTaskSchema.index({ taskId: 1, studentId: 1 }, { unique: true });

export const CompletedTaskModel = mongoose.model('CompletedTask', CompletedTaskSchema); 