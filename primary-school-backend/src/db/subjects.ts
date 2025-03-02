import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    descriptions: { type: String, required: true },
});

const SubjectsSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    time: { type: [String], required: true }, // Assuming time is an array of strings
    tasks: { type: [TaskSchema], required: true }, // Array of task objects
});


export const SubjectsModel = mongoose.model("Subjects", SubjectsSchema);

export const getAllSubjects = () => SubjectsModel.find();

export const getSubjectByName = (name: string) => SubjectsModel.findOne({name});

export const getSubjectTaskById = (id: string) => SubjectsModel.findById(id).exec();

export const getSubjectByCode = (code: string) => SubjectsModel.findOne({code});
