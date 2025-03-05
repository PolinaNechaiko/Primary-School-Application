import {Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography, CircularProgress, Alert} from '@mui/material';
import {useEffect, useState} from 'react';
import {FormTextField} from "../../components/FormTextField/FormTextField.tsx";
import {useNavigate} from "react-router-dom";
import {getSubjectsList} from "../../services/api/subjects.ts";
import {getStudentSubjects} from "../../services/api/subjectsApi.ts";
import {useAuth} from "../../hooks/useAuth";
import {AppRoutes} from "../../utils/AppRoutes.ts";
import AddIcon from '@mui/icons-material/Add';
import {getSubjectsByTeacher} from "../../services/api/subjectsApi.ts";

const Subjects = () => {
    const nav = useNavigate();
    const { user } = useAuth();
    const isStudent = user?.role === 'student';
    const isTeacher = user?.role === 'teacher';
    
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let response;
                if (isStudent && user?._id) {
                    // If user is a student, fetch only subjects they've joined
                    response = await getStudentSubjects(user._id);
                } else if (isTeacher && user?._id) {
                    // If user is a teacher, fetch only subjects they've created
                    response = await getSubjectsByTeacher(user._id);
                } else {
                    // Fallback to all subjects
                    response = await getSubjectsList();
                }
                
                setSubjects(response);
            } catch (err) {
                console.error('Error fetching subjects:', err);
                setError('Помилка при завантаженні предметів');
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [isStudent, isTeacher, user?._id]);

    const navigateToSubjectDetails = (id: string) => {
        nav(`/subjects/${id}`);
    };

    const navigateToCreateSubject = () => {
        nav(AppRoutes.CREATE_SUBJECT);
    };

    const navigateToJoinSubject = () => {
        nav(AppRoutes.JOIN_SUBJECT);
    };

    const filteredSubjects = subjects?.filter((subject) => {
        return subject?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{padding: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h5" component="h1">
                    {isStudent ? 'Мої предмети' : 'Предмети'}
                </Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    {isTeacher && (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<AddIcon />}
                            onClick={navigateToCreateSubject}
                        >
                            Створити предмет
                        </Button>
                    )}
                    {isStudent && (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<AddIcon />}
                            onClick={navigateToJoinSubject}
                        >
                            Приєднатися до предмету
                        </Button>
                    )}
                </Box>
            </Box>
            
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 3}}>
                <FormTextField sx={{flex: '1'}}
                               inputProps={{
                                   id: 'name',
                                   fullWidth: true,
                                   onChange: (e) => setSearchTerm(e.target.value)
                               }}
                               label="Пошук предмету"
                />
            </Box>
            
            {filteredSubjects.length > 0 ? (
                <Box sx={{marginTop: 3}}>
                    <Paper sx={{width: '100%', overflow: 'hidden'}}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Назва предмету</TableCell>
                                    <TableCell>Опис</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSubjects.map((subject) => (
                                    <TableRow 
                                        onClick={() => navigateToSubjectDetails(subject._id)}
                                        sx={{":hover": {backgroundColor: 'rgb(233, 242, 252)', cursor: "pointer"}}}
                                        key={subject._id}
                                    >
                                        <TableCell component="th" scope="row">
                                            {subject.name}
                                        </TableCell>
                                        <TableCell>
                                            {subject.description}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            ) : (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        {isStudent 
                            ? 'Ви ще не приєдналися до жодного предмету. Натисніть "Приєднатися до предмету", щоб почати.' 
                            : 'Немає доступних предметів. Натисніть "Створити предмет", щоб додати новий.'}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default Subjects;
