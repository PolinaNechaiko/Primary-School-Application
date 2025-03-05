import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { AppRoutes } from "../utils/AppRoutes";
import { useAuth } from "../hooks/useAuth";

// Define teacher-only routes
const teacherOnlyRoutes = [
    AppRoutes.JOURNAL,
    AppRoutes.STUDENTS,
    AppRoutes.CREATE_SUBJECT
];

// Define student-only routes
const studentOnlyRoutes = [
    AppRoutes.STUDENT_GRADES,
    AppRoutes.STUDENT_TASKS
];

export const PrivateRoute = () => {
    const { pathname } = useLocation();
    const { user, loading } = useAuth();
    const token = Cookies.get('sessionToken');

    // If still loading, you could show a loading spinner here
    if (loading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!token || !user) {
        return <Navigate to={AppRoutes.LOGIN} />;
    }

    // Check if the current route is teacher-only and user is a student
    if (user?.role === 'student' && teacherOnlyRoutes.some(route => pathname.startsWith(route))) {
        return <Navigate to={AppRoutes.SUBJECTS} />;
    }

    // Check if the current route is student-only and user is a teacher
    if (user?.role === 'teacher' && studentOnlyRoutes.some(route => pathname.startsWith(route))) {
        return <Navigate to={AppRoutes.SUBJECTS} />;
    }

    return <Outlet />;
};