import mongoose from 'mongoose';

const AttachmentSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['video', 'image', 'text', 'game'], 
        required: true 
    },
    url: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String 
    }
});

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [AttachmentSchema],
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export const TaskModel = mongoose.model('Task', TaskSchema); 