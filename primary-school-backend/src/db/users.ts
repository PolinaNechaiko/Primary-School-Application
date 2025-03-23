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
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
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

export const getUsersByRole = async (role: string, filterByIds?: mongoose.Types.ObjectId[] | string[]) => {
    try {
        // Створюємо базовий запит для пошуку користувачів за роллю
        let query: any = { role };
        
        // Якщо передано масив ID для фільтрації, додаємо його до запиту
        if (filterByIds && filterByIds.length > 0) {
            query._id = { $in: filterByIds };
            console.log(`Filtering ${role} users by ${filterByIds.length} IDs`);
        }
        
        const users = await UserModel.find(query)
            .select('-authentication.password -authentication.salt -authentication.sessionToken')
            .populate({
                path: 'subjects',
                select: 'name description code time students',
                options: { strictPopulate: false }
            });
        
        console.log(`Found ${users.length} ${role} users matching criteria`);
        
        // Спрощуємо відповідь для фронтенду
        return users.map(user => ({
            _id: user._id,
            firstName: user.username?.split(' ')[0] || '',
            lastName: user.username?.split(' ')[1] || '',
            email: user.email,
            subjects: user.subjects?.map((subject: any) => ({
                _id: subject._id,
                name: subject.name
            })),
            role: user.role,
            isJoinedToSubject: user.isJoinedToSubject
        }));
    } catch (error) {
        console.error(`Error getting ${role} users:`, error);
        throw error;
    }
};