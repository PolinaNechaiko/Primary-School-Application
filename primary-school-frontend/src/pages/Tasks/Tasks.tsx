import {useEffect, useState} from "react";
import {ITask} from "../../interfaces/Task.ts";
import {Container} from "@mui/material";
import {TaskForm} from "../../components/Tasks/TaskForm.tsx";
import {TasksTable} from "../../components/Tasks/TaskTable.tsx";
import {useSearchParams} from "react-router-dom";
import {getTasksList} from "../../services/api/subjects.ts";

const Tasks = () => {
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('id');
    useEffect(() => {
        const fetchAllTasks = async () => {
            if(!taskId) return;
            const response = await getTasksList(taskId);
            setTasks(response);
        }

        fetchAllTasks();
    }, [taskId]);

    const [tasks, setTasks] = useState<[] | ITask[]>([]);

    const addTask = (newTask: ITask) => {
        setTasks([...tasks, newTask]);
    };
    console.log(tasks)
    return (
        <Container>
            <TaskForm taskId={taskId} addTask={addTask}/>
            <TasksTable tasks={tasks}/>
        </Container>
    );
};

export default Tasks;
