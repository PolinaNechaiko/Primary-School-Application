import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import {ITask} from "../../interfaces/Task.ts";
import {FormTextField} from "../FormTextField/FormTextField.tsx";

interface TaskFormProps {
    addTask: (task: ITask) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        const newTask = { id: Date.now(), title, description };
        addTask(newTask);
        setTitle('');
        setDescription('');
    };

    return (
        <Box sx={{display:'flex',gap:2,alignItems:'center'}}>
            <FormTextField
                label="Назва задачі"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
             inputProps={{id:'title'}}/>
            <FormTextField
                label="Опис задачі"
                inputProps={{id:'description'}}
                // value={description}
                // onChange={(e) => setDescription(e.target.value)}
            />
            <Button sx={{height:'40px'}} variant='contained' onClick={handleSubmit}>Добавити задачу</Button>
        </Box>
    );
};
