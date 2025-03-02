import {Navigate, Outlet} from "react-router-dom";
import {AppRoutes} from "../utils/AppRoutes.ts";
import Cookies from "js-cookie";

export const PrivateRoute = () => {
    const isAuth = Cookies.get('sessionToken');

    
    if (!isAuth) {
        return <Navigate to={AppRoutes.LOGIN} replace />;
    }

    
    return <Outlet />;
}