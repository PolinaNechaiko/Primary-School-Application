import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import {ITask} from "../../interfaces/Task.ts";

interface TasksTableProps {
    tasks: ITask[];
}

export const TasksTable: React.FC<TasksTableProps> = ({ tasks }) => {
    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Назва задачі</TableCell>
                        <TableCell>Опис задачі</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task._id}>
                            <TableCell>{task.name}</TableCell>
                            <TableCell>{task.descriptions}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};
