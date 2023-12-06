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
        if (!title || !description) return;
        const newTask = { id: Date.now(), title, description };
        addTask(newTask);
        setTitle('');
        setDescription('');
    };

    return (
        <Box sx={{display:'flex',gap:2,flexDirection:'column'}}>
            <FormTextField
                label="Назва задачі"
                // value={title}
                // onChange={(e) => setTitle(e.target.value)}
             inputProps={{id:'title',fullWidth:true}}/>
            <FormTextField
                label="Опис задачі"
                inputProps={{id:'description',fullWidth:true}}
                // value={description}
                // onChange={(e) => setDescription(e.target.value)}
            />
            <Button sx={{height:'40px',width:'250px'}} variant='contained' onClick={handleSubmit}>Добавити задачу</Button>
        </Box>
    );
};
