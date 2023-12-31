import './App.css'
import {Route, Routes} from "react-router-dom";
import {PrivateRoute, PublicRoute} from "./hoc";
import {PrivateLayout, PublicLayout} from "./layout";
import {AppRoutes} from "./utils/AppRoutes.ts";
import Login from "./pages/Login/Login.tsx";
import Registration from "./pages/Registration/Registration.tsx";
import Journal from "./pages/Journal/Journal.tsx";
import Tasks from "./pages/Tasks/Tasks.tsx";
import ComingSoon from "./pages/ComingSoon/ComingSoon.tsx";
import Subjects from "./pages/Classes/Classes.tsx";
import Schedule from "./pages/Schedule/Schedule.tsx";
import {API, configureInterceptorsForProject} from "./services";

function App() {
    configureInterceptorsForProject(API);
    return (
        <Routes>
            <Route path="" element={<PrivateRoute/>}>
                <Route
                    path="/"
                    element={<PrivateLayout/>}
                >
                    <Route index path={AppRoutes.MAIN} element={<div>основна</div>}/>
                    <Route index path={AppRoutes.JOURNAL} element={<Journal/>}/>
                    <Route index path={AppRoutes.TASKS} element={<Tasks/>}/>

                    <Route index path={AppRoutes.SUBJECTS} element={<Subjects/>}/>
                    <Route index path={AppRoutes.SCHEDULE} element={<Schedule/>}/>

                    <Route path="*" element={<ComingSoon />} />

                </Route>
            </Route>

            <Route path="" element={<PublicRoute/>}>

                <Route path={AppRoutes.DEFAULT}
                       element={<PublicLayout/>}>
                    <Route path={AppRoutes.LOGIN} element={<Login/>}/>
                    <Route path={AppRoutes.REGISTER} element={<Registration/>}/>

                </Route>
            </Route>
        </Routes>
    )
}

export default App
