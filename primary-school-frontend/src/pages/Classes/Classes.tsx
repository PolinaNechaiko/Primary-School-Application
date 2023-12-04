import {Box, Paper, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import {useEffect, useState} from 'react';
import {FormTextField} from "../../components/FormTextField/FormTextField.tsx";
import {useNavigate} from "react-router-dom";
import {getSubjectsList} from "../../services/api/subjects.ts";

const Subjects = () => {
    const nav = useNavigate();
    const [subjects, setSubjects] = useState<any[]>([]);
    useEffect(() => {
        const fetchAllSubjects = async () => {
            const response = await getSubjectsList();
            setSubjects(response);
        }

        fetchAllSubjects();
    }, []);
    const navigateToTasks = (id: number) => {
        nav(`/tasks?id=${id}`);
    }
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSubjects = subjects?.filter((subject) => {
        return subject?.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    return (
        <Box sx={{padding: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <FormTextField sx={{flex: '1'}}
                               inputProps={{
                                   id: 'name',
                                   fullWidth: true,
                                   onChange: (e) => setSearchTerm(e.target.value)
                               }}
                               label="Пошук предмету"
                />
            </Box>
            <Box sx={{marginTop: 3}}>
                <Paper sx={{width: '100%', overflow: 'hidden'}}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Назва предмету</TableCell>
                                {/*<TableCell>Students</TableCell>*/}
                                {/*<TableCell align="right">Schedule</TableCell>*/}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSubjects.map((classInfo) => (
                                <TableRow onClick={() => navigateToTasks(classInfo._id)}
                                          sx={{":hover": {backgroundColor: 'rgb(233, 242, 252)', cursor: "pointer"}}}
                                          key={classInfo._id}>
                                    <TableCell component="th" scope="row">
                                        {classInfo.name}
                                    </TableCell>
                                    {/*<TableCell>{classInfo.students}</TableCell>*/}
                                    {/*<TableCell align="right">{classInfo.schedule}</TableCell>*/}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Box>
    );
};

export default Subjects;
