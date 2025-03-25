import './App.css'
import {Route, Routes} from "react-router-dom";
import {PrivateRoute, PublicRoute} from "./hoc";
import {PrivateLayout, PublicLayout} from "./layout";
import {AppRoutes} from "./utils/AppRoutes.ts";
import Login from "./pages/Login/Login.tsx";
import Registration from "./pages/Registration/Registration.tsx";
import Journal from "./pages/Journal/Journal.tsx";
import ComingSoon from "./pages/ComingSoon/ComingSoon.tsx";
import Subjects from "./pages/Classes/Classes.tsx";
import SubjectDetails from "./pages/Subjects/SubjectDetails.tsx";
import Schedule from "./pages/Schedule/Schedule.tsx";
import {API, configureInterceptorsForProject} from "./services";
import CreateSubject from './pages/CreateSubject/CreateSubject.tsx';
import JoinSubject from './components/JoinSubject/JoinSubject.tsx';
import Students from './pages/Students/Students.tsx';
import WeeklyGame from './pages/WeeklyGame';
import StudentGrades from './pages/StudentGrades';
import StudentTasks from './pages/StudentTasks';
import TaskResponses from './pages/TaskResponses/TaskResponses.tsx';

function App() {
    configureInterceptorsForProject(API);
    return (
        <Routes>
            <Route path="" element={<PrivateRoute/>}>
                <Route path={AppRoutes.CREATE_SUBJECT} element={<CreateSubject />} />
                <Route path={AppRoutes.JOIN_SUBJECT} element={<JoinSubject />} />

                <Route path="/" element={<PrivateLayout/>}>
                    {/* Common routes for both teachers and students */}
                    <Route index path={AppRoutes.MAIN} element={<div>основна</div>}/>
                    <Route index path={AppRoutes.SUBJECTS} element={<Subjects/>}/>
                    <Route path={`${AppRoutes.SUBJECTS}/:subjectId`} element={<SubjectDetails />} />
                    <Route index path={AppRoutes.SCHEDULE} element={<Schedule/>}/>
                    <Route index path={AppRoutes.WEEKLY_GAME} element={<WeeklyGame/>}/>
                    
                    {/* Teacher-specific routes */}
                    <Route index path={AppRoutes.JOURNAL} element={<Journal/>}/>
                    <Route index path={AppRoutes.STUDENTS} element={<Students/>}/>
                    <Route path={AppRoutes.TASK_RESPONSES} element={<TaskResponses/>}/>
                    
                    {/* Student-specific routes */}
                    <Route index path={AppRoutes.STUDENT_GRADES} element={<StudentGrades/>}/>
                    <Route index path={AppRoutes.STUDENT_TASKS} element={<StudentTasks/>}/>
                    
                    <Route path="*" element={<ComingSoon />} />
                </Route>
            </Route>

            <Route path="" element={<PublicRoute/>}>
                <Route path={AppRoutes.DEFAULT} element={<PublicLayout/>}>
                    <Route path={AppRoutes.LOGIN} element={<Login/>}/>
                    <Route path={AppRoutes.REGISTER} element={<Registration/>}/>
                </Route>
            </Route>
        </Routes>
    )
}

export default App
