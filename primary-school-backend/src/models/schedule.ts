import mongoose from 'mongoose';

const ScheduleItemSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    dayOfWeek: { type: Number, required: true, min: 1, max: 7 }, // 1 - понеділок, 7 - неділя
    startTime: { type: String, required: true }, // Формат "HH:MM"
    endTime: { type: String, required: true }, // Формат "HH:MM"
});

const ScheduleSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [ScheduleItemSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const ScheduleModel = mongoose.model('Schedule', ScheduleSchema); 