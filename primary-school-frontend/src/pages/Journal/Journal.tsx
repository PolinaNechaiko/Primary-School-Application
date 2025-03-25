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
    InputLabel,
    ButtonGroup,
    Chip,
    Tooltip
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

interface Subject {
    _id: string;
    name: string;
    description: string;
    coverImage: string;
    code: string;
    time: string[];
    __v: number;
}

interface Task {
    _id: string;
    name: string;
    description: string;
    subject: string;
    createdBy: string;
    createdAt: string;
    content?: {
        text?: string;
        video?: string;
        images?: string[];
        learningApp?: string;
    };
}

interface Student {
    _id: string;
    firstName: string;
    lastName: string;
}

interface QuickAccessSubject {
    id: string | number;
    name: string;
}

const Journal = () => {
    const { user, loading: userLoading } = useAuth();
    const isTeacher = user?.role === 'teacher';
    
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [grades, setGrades] = useState<Record<string, Record<string, string>>>({});
    const [loading, setLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [currentStudent, setCurrentStudent] = useState<string | null>(null);
    const [currentTask, setCurrentTask] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (user && !userLoading && isTeacher) {
            fetchData();
        }
    }, [user, userLoading, isTeacher]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Отримуємо список предметів
            const subjectsData = await getSubjects();

            setSubjects(subjectsData);

            // Отримуємо список студентів
            const studentsData = await getStudentsList();
            console.log('Students data:', studentsData);
            setStudents(studentsData);

        
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Помилка при завантаженні даних');
        } finally {
            setLoading(false);
        }
    };



    const fetchTasksForSubject = async (subjectId: string) => {
        try {
            setTasksLoading(true);
            console.log('Fetching tasks for subject:', subjectId);
            const tasksData = await getTasksBySubject(subjectId);
            console.log('Tasks data:', tasksData);
            setTasks(tasksData);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Помилка при завантаженні завдань');
            setTasks([]);
        } finally {
            setTasksLoading(false);
        }
    };

    const handleSubjectChange = async (subjectId: string) => {
        try {
            setLoading(true);
            setSelectedSubject(subjectId);

            // Fetch tasks for the selected subject
            await fetchTasksForSubject(subjectId);

            try {
                const gradesData = await getGradesForJournal(subjectId);
                setGrades(gradesData || {});
            } catch (gradeError) {
                console.error('Error fetching grades:', gradeError);
                setGrades({});
            }
        } catch (error: any) {
            console.error('Error changing subject:', error);
            setError('Помилка при зміні предмету');
        } finally {
            setLoading(false);
        }
    };

    const handleGradeClick = (event: React.MouseEvent<HTMLButtonElement>, studentId: string, taskId: string) => {
        setAnchorEl(event.currentTarget);
        setCurrentStudent(studentId);
        setCurrentTask(taskId);
    };

    const handleGradeClose = () => {
        setAnchorEl(null);
        setCurrentStudent(null);
        setCurrentTask(null);
    };

    const handleSetGrade = async (grade: string) => {
        if (!currentStudent || !currentTask || !selectedSubject) return;
        
        try {
            await setGrade({
                studentId: currentStudent,
                taskId: currentTask,
                subjectId: selectedSubject,
                grade
            });
            
            // Оновлюємо локальний стан оцінок
            setGrades(prev => {
                const updatedGrades = { ...prev };
                if (!updatedGrades[currentStudent]) {
                    updatedGrades[currentStudent] = {};
                }
                updatedGrades[currentStudent][currentTask] = grade;
                return updatedGrades;
            });
            
            setSnackbarMessage('Оцінка успішно виставлена');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error setting grade:', error);
            setSnackbarMessage('Помилка при виставленні оцінки');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            handleGradeClose();
        }
    };

    const getGradeIcon = (grade: string): JSX.Element => {
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
                return <SentimentSatisfiedIcon color="disabled" />;
        }
    };

    const getGradeText = (grade: string) => {
        switch (grade) {
            case 'excellent':
                return 'Відмінно';
            case 'good':
                return 'Добре';
            case 'satisfactory':
                return 'Задовільно';
            case 'poor':
                return 'Потребує доопрацювання';
            default:
                return '';
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
        
            
            <Box sx={{ mt: 4, mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Оберіть предмет</InputLabel>
                    <Select
                        value={selectedSubject || ''}
                        onChange={(e) => handleSubjectChange(e.target.value as string)}
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
            
            {loading || tasksLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            ) : tasks.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Для цього предмету ще не створено завдань
                </Alert>
            ) : students.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    До цього предмету ще не приєднались учні
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Учень</TableCell>
                                {tasks.map((task) => (
                                    <TableCell key={task._id} align="center" sx={{ fontWeight: 'bold' }}>
                                        <Tooltip title={task.description || ''} arrow>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                                {task.name}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student._id}>
                                    <TableCell>
                                        {student.firstName} {student.lastName}
                                    </TableCell>
                                    {tasks.map((task) => (
                                        <TableCell key={task._id} align="center">
                                            <Button
                                                onClick={(e) => handleGradeClick(e, student._id, task._id)}
                                                sx={{ minWidth: 'auto', p: 1 }}
                                            >
                                                {getGradeIcon(grades[student._id]?.[task._id] || '')}
                                            </Button>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                    <Typography variant="subtitle2" gutterBottom>
                        Виберіть оцінку:
                    </Typography>
                    <ButtonGroup orientation="vertical" variant="outlined" sx={{ mt: 1 }}>
                        <Button 
                            onClick={() => handleSetGrade('excellent')}
                            startIcon={<SentimentVerySatisfiedIcon color="success" />}
                            sx={{ justifyContent: 'flex-start', mb: 1 }}
                        >
                            Відмінно
                        </Button>
                        <Button 
                            onClick={() => handleSetGrade('good')}
                            startIcon={<SentimentSatisfiedIcon color="primary" />}
                            sx={{ justifyContent: 'flex-start', mb: 1 }}
                        >
                            Добре
                        </Button>
                        <Button 
                            onClick={() => handleSetGrade('satisfactory')}
                            startIcon={<SentimentDissatisfiedIcon color="warning" />}
                            sx={{ justifyContent: 'flex-start', mb: 1 }}
                        >
                            Задовільно
                        </Button>
                        <Button 
                            onClick={() => handleSetGrade('poor')}
                            startIcon={<SentimentVeryDissatisfiedIcon color="error" />}
                            sx={{ justifyContent: 'flex-start' }}
                        >
                            Потребує доопрацювання
                        </Button>
                    </ButtonGroup>
                </Box>
            </Popover>
            
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Journal;
