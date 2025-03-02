import mongoose from 'mongoose';

const GradeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    grade: { type: String, enum: ['excellent', 'good', 'satisfactory', 'poor'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export const GradeModel = mongoose.model('Grade', GradeSchema); 