import React, {useState} from 'react';
import {Box, Button} from '@mui/material';
import {ITask} from "../../interfaces/Task.ts";
import {FormTextField} from "../FormTextField/FormTextField.tsx";
import {createNewTask} from "../../services/api/subjects.ts";

interface TaskFormProps {
    addTask: (task: ITask) => void;
    taskId: string | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({addTask, taskId}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!title || !description || !taskId) return;
        const newTask = {_id: Date.now(),name: title, descriptions:description};
        addTask(newTask);
        await createNewTask({name: title, description, subjectId: taskId});
        setTitle('');
        setDescription('');
    };

    return (
        <Box sx={{display: 'flex', gap: 2, flexDirection: 'column'}}>
            <FormTextField
                label="Назва задачі"
                inputProps={{
                    id: 'title', fullWidth: true,
                    value: title,
                    onChange: (e) => setTitle(e.target.value)
                }}
            />
            <FormTextField
                label="Опис задачі"
                inputProps={{
                    id: 'description',
                    fullWidth: true,
                    value: description,
                    onChange: (e) => setDescription(e.target.value)
                }}
            />
            <Button sx={{height: '40px', width: '250px'}} variant='contained' onClick={handleSubmit}>Добавити
                задачу</Button>
        </Box>
    );
};
