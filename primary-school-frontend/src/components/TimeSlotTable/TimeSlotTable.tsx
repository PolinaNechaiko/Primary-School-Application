import React from 'react';
import {Paper, Table, TableBody, TableCell, TableHead, TableRow,Typography} from '@mui/material';
import {ISubject} from "../../interfaces/ISubject.ts";

interface TimeSlotTableProps {
    subjects: ISubject[];
    // schedule: Schedule[]; (Assuming you have a schedule type)
}

export const TimeSlotTable: React.FC<TimeSlotTableProps> = ({ subjects /*, schedule*/ }) => {
    return (
        <Paper>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Назва предмету</TableCell>
                    <TableCell>Час проведення уроку</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                        <TableCell>{subject.label}</TableCell>
                        <TableCell>{subject.time.map((item) => (
                            <Typography variant='subtitle2' spacing={2}>{item}</Typography>
                        ))}</TableCell>

                        {/* Render each day of the week as a cell */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </Paper>
    );
};
