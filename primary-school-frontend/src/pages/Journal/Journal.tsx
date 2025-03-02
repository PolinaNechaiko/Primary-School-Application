import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Button, 
    Popover,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getSubjects } from '../../services/api/subjectsApi';
import { getTasksBySubject } from '../../services/api/tasksApi';
import { getGradesForJournal, setGrade } from '../../services/api/gradesApi';
import { getStudentsList } from '../../services/api/studentsApi';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const Journal = () => {
    const { user, loading: userLoading } = useAuth();
    const isTeacher = user?.role === 'teacher';
    
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [grades, setGrades] = useState<Record<string, Record<string, number>>>({});
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [currentCell, setCurrentCell] = useState<{studentId: string, taskId: string} | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [currentTab, setCurrentTab] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && !userLoading) {
            fetchData();
        }
    }, [user, userLoading]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Отримуємо список предметів
            const subjectsData = await getSubjects();
            console.log('Subjects data:', subjectsData);
            setSubjects(subjectsData);

            if (subjectsData.length > 0) {
                setSelectedSubject(subjectsData[0]._id);
                
                // Отримуємо список студентів
                const studentsData = await getStudentsList();
                console.log('Students data:', studentsData);
                setStudents(studentsData);

                // Отримуємо оцінки для першого предмету
                try {
                    const gradesData = await getGradesForJournal(subjectsData[0]._id);
                    console.log('Grades data:', gradesData);
                    setGrades(gradesData || {});
                } catch (error) {
                    console.error('Error fetching grades:', error);
                    setGrades({});
                }

                // Отримуємо завдання з першого предмету
                if (subjectsData[0].tasks && subjectsData[0].tasks.length > 0) {
                    setTasks(subjectsData[0].tasks);
                    console.log('Tasks:', subjectsData[0].tasks);
                } else {
                    console.log('No tasks found for subject');
                    setTasks([]);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Помилка при завантаженні даних');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleSubjectChange = async (subjectId: string) => {
        try {
            setLoading(true);
            setSelectedSubject(subjectId);

            const selectedSubjectData = subjects.find(s => s._id === subjectId);
            setTasks(selectedSubjectData?.tasks || []);

            const gradesData = await getGradesForJournal(subjectId);
            setGrades(gradesData);
        } catch (error) {
            console.error('Error changing subject:', error);
            setError('Помилка при зміні предмету');
        } finally {
            setLoading(false);
        }
    };

    const handleGradeClick = (event: React.MouseEvent<HTMLButtonElement>, studentId: string, taskId: string) => {
        setAnchorEl(event.currentTarget);
        setCurrentCell({ studentId, taskId });
    };

    const handleGradeClose = () => {
        setAnchorEl(null);
        setCurrentCell(null);
    };

    const handleSetGrade = async (grade: string) => {
        if (!currentCell || !selectedSubject) return;
        
        try {
            const { studentId, taskId } = currentCell;
            
            await setGrade({
                studentId,
                taskId,
                subjectId: selectedSubject,
                grade
            });
            
            // Оновлюємо локальний стан оцінок
            setGrades(prev => ({
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    [taskId]: grade
                }
            }));
            
            setSnackbarMessage('Оцінка успішно виставлена');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error setting grade:', error);
            setSnackbarMessage('Помилка при виставленні оцінки');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            handleGradeClose();
        }
    };

    const getGradeIcon = (grade: string) => {
        switch (grade) {
            case 'excellent':
                return <SentimentVerySatisfiedIcon color="success" />;
            case 'good':
                return <SentimentSatisfiedIcon color="primary" />;
            case 'satisfactory':
                return <SentimentDissatisfiedIcon color="warning" />;
            case 'poor':
                return <SentimentVeryDissatisfiedIcon color="error" />;
            default:
                return null;
        }
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'grade-popover' : undefined;

    if (userLoading || loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!isTeacher) {
        return (
            <Container>
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Доступ до журналу мають тільки вчителі
                </Typography>
            </Container>
        );
    }
    
    if (!subjects.length) {
        return (
            <Container>
                <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>
                    У вас поки немає предметів для ведення журналу
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h1" gutterBottom>
                Журнал
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="ЯФС" />
                    <Tab label="Матем." />
                    <Tab label="Укр мова" />
                </Tabs>
            </Box>
            
            <Box sx={{ mt: 4, mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Оберіть предмет</InputLabel>
                    <Select
                        value={selectedSubject || ''}
                        onChange={(e) => handleSubjectChange(e.target.value)}
                        label="Оберіть предмет"
                    >
                        {subjects.map((subject) => (
                            <MenuItem key={subject._id} value={subject._id}>
                                {subject.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {tasks.length === 0 ? (
                        <Typography variant="body1">
                            Для цього предмету ще не створено завдань
                        </Typography>
                    ) : students.length === 0 ? (
                        <Typography variant="body1">
                            До цього предмету ще не приєдналися учні
                        </Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Учень</TableCell>
                                        {tasks.map((task) => (
                                            <TableCell key={task._id} align="center">
                                                {task.name}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student._id}>
                                            <TableCell component="th" scope="row">
                                                {student.username}
                                            </TableCell>
                                            {tasks.map((task) => (
                                                <TableCell key={task._id} align="center">
                                                    {grades[student._id]?.[task._id] ? (
                                                        <Button
                                                            onClick={(e) => handleGradeClick(e, student._id, task._id)}
                                                        >
                                                            {getGradeIcon(grades[student._id][task._id])}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={(e) => handleGradeClick(e, student._id, task._id)}
                                                        >
                                                            Оцінити
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
            
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleGradeClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Виберіть оцінку:
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="success" 
                                onClick={() => handleSetGrade('excellent')}
                                startIcon={<SentimentVerySatisfiedIcon />}
                            >
                                Відмінно
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => handleSetGrade('good')}
                                startIcon={<SentimentSatisfiedIcon />}
                            >
                                Добре
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="warning" 
                                onClick={() => handleSetGrade('satisfactory')}
                                startIcon={<SentimentDissatisfiedIcon />}
                            >
                                Задовільно
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="error" 
                                onClick={() => handleSetGrade('poor')}
                                startIcon={<SentimentVeryDissatisfiedIcon />}
                            >
                                Незадовільно
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Popover>
            
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                    <Alert onClose={() => setError(null)} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
};

export default Journal;
