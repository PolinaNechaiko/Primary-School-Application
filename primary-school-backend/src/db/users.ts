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
export const allowedRoles = ['user', 'teacher'];

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
        return await UserModel.find({ role })
            .select('-authentication')
            .populate('subjects');
    } catch (error) {
        console.error('Error getting users by role:', error);
        throw error;
    }
};