import {Navigate, Outlet} from "react-router-dom";
import {AppRoutes} from "../utils/AppRoutes.ts";
import Cookies from "js-cookie";
import { useAuth } from "../hooks/useAuth";
import JoinSubject from "../components/JoinSubject/JoinSubject";
import CreateSubject from "../pages/CreateSubject/CreateSubject";

export const PrivateRoute = () => {
    const isAuth = Cookies.get('sessionToken');
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!isAuth) {
        return <Navigate to={AppRoutes.LOGIN} replace />;
    }
    
    // Якщо користувач - вчитель і не має створених предметів, показуємо форму створення предмету
    if (user?.role === 'teacher' && (!user.subjects || user.subjects.length === 0)) {
        return <CreateSubject />;
    }
    
    // Якщо користувач - учень і не приєднався до предмету, показуємо компонент JoinSubject
    if (user?.role === 'user' && !user.isJoinedToSubject) {
        return <JoinSubject />;
    }
    
    return <Outlet />;
}