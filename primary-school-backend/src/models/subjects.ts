import mongoose from 'mongoose';

const SubjectsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ 
        name: { type: String, required: true },
        descriptions: { type: String }
    }],
    coverImage: { type: String },
    time: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

export const SubjectsModel = mongoose.model('Subject', SubjectsSchema); 