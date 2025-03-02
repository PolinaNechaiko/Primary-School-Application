import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    content: {
        video: { type: String },
        images: [{ type: String }],
        text: { type: String },
        learningApp: { type: String } // URL для інтеграції з LearningApps
    },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export const TaskModel = mongoose.model('Task', TaskSchema); 