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
    tasks: Task[];
    __v: number;
}

interface Task {
    _id: string;
    name: string;
    descriptions: string;
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
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [currentStudent, setCurrentStudent] = useState<string | null>(null);
    const [currentTask, setCurrentTask] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [currentTab, setCurrentTab] = useState(0);
    const [error, setError] = useState<string | null>(null);
    
    // Предмети для швидкого доступу у вкладках
    const [quickAccessSubjects, setQuickAccessSubjects] = useState<QuickAccessSubject[]>([
        { id: 0, name: 'Я досліджую світ' },
        { id: 1, name: 'Математика' },
        { id: 2, name: 'Українська мова' }
    ]);

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

            // Отримуємо список студентів
            const studentsData = await getStudentsList();
            console.log('Students data:', studentsData);
            setStudents(studentsData);

            // Створюємо масив для швидкого доступу до предметів
            if (subjectsData && subjectsData.length > 0) {
                // Шукаємо предмети, які відповідають нашим стандартним вкладкам
                const standardSubjects = [
                    'Я досліджую світ',
                    'Математика',
                    'Українська мова'
                ];
                
                const foundSubjects = standardSubjects.map((name, index) => {
                    const found = subjectsData.find((s: Subject) => s.name === name);
                    return found 
                        ? { id: found._id, name: found.name } 
                        : { id: index, name };
                });
                
                // Якщо знайдено менше 3 стандартних предметів, додаємо інші з наявних
                if (foundSubjects.filter(s => typeof s.id === 'string').length < 3) {
                    const additionalSubjects = subjectsData
                        .filter((s: Subject) => !standardSubjects.includes(s.name))
                        .slice(0, 3 - foundSubjects.filter((s: QuickAccessSubject) => typeof s.id === 'string').length)
                        .map((s: Subject) => ({ id: s._id, name: s.name }));
                    
                    // Замінюємо числові id на реальні id предметів
                    for (let i = 0; i < foundSubjects.length; i++) {
                        if (typeof foundSubjects[i].id === 'number' && additionalSubjects.length > 0) {
                            foundSubjects[i] = additionalSubjects.shift()!;
                        }
                    }
                }
                
                setQuickAccessSubjects(foundSubjects);
                
                // Вибираємо перший предмет для відображення
                const firstSubject = foundSubjects.find(s => typeof s.id === 'string');
                if (firstSubject && typeof firstSubject.id === 'string') {
                    await handleSubjectChange(firstSubject.id);
                } else if (subjectsData.length > 0) {
                    await handleSubjectChange(subjectsData[0]._id);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Помилка при завантаженні даних');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = async (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        
        const selectedTab = quickAccessSubjects[newValue];
        if (selectedTab && typeof selectedTab.id === 'string') {
            await handleSubjectChange(selectedTab.id);
        }
    };

    const handleSubjectChange = async (subjectId: string) => {
        try {
            setLoading(true);
            setSelectedSubject(subjectId);

            const selectedSubjectData = subjects.find(s => s._id === subjectId);
            if (selectedSubjectData && selectedSubjectData.tasks) {
                setTasks(selectedSubjectData.tasks);
            } else {
                setTasks([]);
            }

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
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    {quickAccessSubjects.map((subject, index) => (
                        <Tab key={index} label={subject.name} />
                    ))}
                </Tabs>
            </Box>
            
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
            
            {loading ? (
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
                                        <Tooltip title={task.descriptions || ''} arrow>
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
                                <TableRow key={student._id} hover>
                                    <TableCell component="th" scope="row">
                                        {student.firstName} {student.lastName}
                                    </TableCell>
                                    {tasks.map((task) => {
                                        const grade = grades[student._id]?.[task._id];
                                        return (
                                            <TableCell key={`${student._id}-${task._id}`} align="center">
                                                <Button
                                                    onClick={(e) => handleGradeClick(e, student._id, task._id)}
                                                    variant="outlined"
                                                    color={grade ? 'primary' : 'inherit'}
                                                    size="small"
                                                    sx={{ minWidth: 40, minHeight: 40 }}
                                                >
                                                    {grade ? (
                                                        <Tooltip title={getGradeText(grade)} arrow>
                                                            {getGradeIcon(grade)}
                                                        </Tooltip>
                                                    ) : (
                                                        '+'
                                                    )}
                                                </Button>
                                            </TableCell>
                                        );
                                    })}
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
