import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, required: true, default: "user"},
    isJoinedToSubject: {type: Boolean, default: false},
    subjects: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subjects'}],
    authentication: {
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},
    },
});
// export const allowedRoles = ['doctor', 'user', 'admin'];
export const allowedRoles = ['teacher', 'student'];

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({"authentication.sessionToken": sessionToken});
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (user: Record<string, any>) => new UserModel(user).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({_id: id});
export const updateUserById = (id:string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
export const updateUser = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values, { new: true });

export const getUsersByRole = async (role: string) => {
    try {
        const users = await UserModel.find({ role })
            .select('-authentication.password -authentication.salt -authentication.sessionToken')
            .populate({
                path: 'subjects',
                select: 'name teacher tasks grades',
                populate: [
                    {
                        path: 'teacher',
                        select: 'username email'
                    },
                    {
                        path: 'tasks',
                        select: 'title date'
                    },
                    {
                        path: 'grades',
                        select: 'value student task'
                    }
                ]
            });
        
        // Форматуємо відповідь в залежності від ролі
        return users.map(user => ({
            _id: user._id,
            email: user.email,
            name: user.username,
            subjects: user.subjects?.map((subject: any) => ({
                _id: subject._id,
                name: subject.name,
                teacher: {
                    _id: subject.teacher?._id,
                    name: subject.teacher?.username,
                    email: subject.teacher?.email
                },
                tasks: subject.tasks?.map((task: any) => ({
                    _id: task._id,
                    title: task.title,
                    date: task.date,
                    grades: subject.grades?.filter((grade: any) => 
                        grade.task.toString() === task._id.toString()
                    ).map((grade: any) => ({
                        value: grade.value,
                        studentId: grade.student
                    }))
                }))
            })),
            role: user.role,
            isJoinedToSubject: user.isJoinedToSubject
        }));
    } catch (error) {
        console.error('Error getting users by role:', error);
        throw error;
    }
};