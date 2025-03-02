import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    descriptions: { type: String, required: true },
});

const SubjectsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    time: { type: [String], required: true },
    tasks: { type: [TaskSchema], required: true, default: [] },
});

export const generateUniqueCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;
    
    while (!isUnique) {
        code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        const existingSubject = await getSubjectByCode(code);
        if (!existingSubject) {
            isUnique = true;
        }
    }
    
    return code;
};

export const SubjectsModel = mongoose.model("Subjects", SubjectsSchema);

export const getAllSubjects = () => SubjectsModel.find();

export const getSubjectByName = (name: string) => SubjectsModel.findOne({name});

export const getSubjectTaskById = (id: string) => SubjectsModel.findById(id).exec();

export const getSubjectByCode = (code: string) => SubjectsModel.findOne({code});
