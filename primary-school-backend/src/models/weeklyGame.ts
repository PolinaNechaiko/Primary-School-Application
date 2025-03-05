import mongoose from 'mongoose';

const WeeklyGameSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    gameUrl: { 
        type: String, 
        required: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    active: { 
        type: Boolean, 
        default: true 
    }
});

export const WeeklyGameModel = mongoose.model('WeeklyGame', WeeklyGameSchema); 