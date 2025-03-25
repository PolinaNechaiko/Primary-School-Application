import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    List, 
    ListItem, 
    ListItemText, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Grid,
    Tab,
    Tabs,
    Snackbar,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    IconButton,
    Collapse,
    Checkbox,
    Link as MuiLink,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ForumIcon from '@mui/icons-material/Forum';
import { useAuth } from '../../hooks/useAuth';
import { getTasksBySubject } from '../../services/api/tasksApi';
import { getSubjectById } from '../../services/api/subjectsApi';
import { API } from '../../services';
import Confetti from 'react-confetti';
import { TaskForm } from '../../components/Tasks/TaskForm';
import { getStudentsList } from '../../services/api/studentsApi';
import PeopleIcon from '@mui/icons-material/People';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const SubjectDetails = () => {
    const { subjectId } = useParams();
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';
    const isStudent = user?.role === 'student';
    
    console.log('User:', user);
    console.log('Is teacher:', isTeacher);
    console.log('Is student:', isStudent);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const [subject, setSubject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
    const [taskResponses, setTaskResponses] = useState<Record<string, string>>({});
    const [submittingTask, setSubmittingTask] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
    const [availableStudents, setAvailableStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [taskResponsesCount, setTaskResponsesCount] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (subjectId) {
                    console.log('Fetching subject with ID:', subjectId);
                    try {
                        const subjectData = await getSubjectById(subjectId);
                        console.log('Subject data:', subjectData);
                        console.log('Students in subject:', subjectData?.students || 'No students');
                        if (subjectData?.students) {
                            console.log('Number of students:', subjectData.students.length);
                        }
                        setSubject(subjectData);
                    } catch (error) {
                        console.error('Error fetching subject:', error);
                        setSnackbarMessage('Помилка при завантаженні предмету. Перевірте ID предмету та з\'єднання з сервером.');
                        setSnackbarSeverity('error');
                        setOpenSnackbar(true);
                        setLoading(false);
                        return;
                    }
                    
                    try {
                        console.log('Fetching tasks for subject with ID:', subjectId);
                        const tasksData = await getTasksBySubject(subjectId);
                        console.log('Tasks data:', tasksData);
                        setTasks(tasksData);

                        // Initialize expanded state for all tasks
                        const initialExpandedState: Record<string, boolean> = {};
                        tasksData.forEach((task: any) => {
                            initialExpandedState[task._id] = false;
                        });
                        setExpandedTasks(initialExpandedState);
                    } catch (error) {
                        console.error('Error fetching tasks:', error);
                        setSnackbarMessage('Помилка при завантаженні завдань');
                        setSnackbarSeverity('error');
                        setOpenSnackbar(true);
                    }

                    // Fetch completed tasks for student
                    if (isStudent) {
                        try {
                            console.log('Fetching completed tasks for student with ID:', user?._id);
                            const response = await API.get(`/tasks/completed?studentId=${user?._id}&subjectId=${subjectId}`);
                            console.log('Completed tasks:', response.data);
                            setCompletedTasks(response.data.map((task: any) => task.taskId));
                        } catch (error) {
                            console.error('Error fetching completed tasks:', error);
                            setSnackbarMessage('Помилка при завантаженні виконаних завдань');
                            setSnackbarSeverity('error');
                            setOpenSnackbar(true);
                        }
                    }
                } else {
                    console.error('No subject ID provided');
                    setSnackbarMessage('ID предмету не вказано');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setSnackbarMessage('Помилка при завантаженні даних');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [subjectId, user?._id, isStudent]);

    useEffect(() => {
        if (isTeacher && tasks.length > 0) {
            fetchTaskResponsesCounts();
        }
    }, [isTeacher, tasks]);

    const fetchTaskResponsesCounts = async () => {
        try {
            // Отримуємо кількість відповідей для кожного завдання
            const countsMap: Record<string, number> = {};
            
            for (const task of tasks) {
                try {
                    const response = await API.get(`/tasks/responses/${task._id}`);
                    countsMap[task._id] = response.data.length;
                } catch (error) {
                    console.error(`Error fetching responses count for task ${task._id}:`, error);
                    countsMap[task._id] = 0;
                }
            }
            
            setTaskResponsesCount(countsMap);
        } catch (error) {
            console.error('Error fetching task responses counts:', error);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const playAudio = (audioSrc: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioSrc;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const toggleTaskExpand = (taskId: string) => {
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const handleTaskResponseChange = (taskId: string, value: string) => {
        setTaskResponses(prev => ({
            ...prev,
            [taskId]: value
        }));
    };

    const handleSubmitTaskResponse = async (taskId: string) => {
        if (!taskResponses[taskId]?.trim()) {
            setSnackbarMessage('Будь ласка, введіть відповідь на завдання');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        setSubmittingTask(taskId);
        
        try {
            await API.post('/tasks/submit', {
                taskId,
                subjectId,
                studentId: user?._id,
                response: taskResponses[taskId]
            });
            
            // Show confetti animation
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
            
            // Play success audio
            playAudio('/audio/task-completed.mp3');
            
            // Add to completed tasks
            setCompletedTasks(prev => [...prev, taskId]);
            
            // Clear response
            setTaskResponses(prev => ({
                ...prev,
                [taskId]: ''
            }));
            
            setSnackbarMessage('Ура! Молодець, ти виконав завдання!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error submitting task response:', error);
            setSnackbarMessage('Помилка при відправленні відповіді');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setSubmittingTask(null);
        }
    };

    const handleOpenAddStudentDialog = async () => {
        try {
            setLoadingStudents(true);
            // Отримуємо список всіх доступних студентів
            const students = await getStudentsList();
            
            // Фільтруємо студентів, виключаючи тих, хто вже записаний на предмет
            const subjectStudentIds = subject.students ? subject.students.map((s: any) => s._id) : [];
            const filteredStudents = students.filter(student => 
                !subjectStudentIds.includes(student._id)
            );
            
            setAvailableStudents(filteredStudents);
            setOpenAddStudentDialog(true);
        } catch (error) {
            console.error('Error fetching available students:', error);
            setSnackbarMessage('Помилка при завантаженні списку учнів');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoadingStudents(false);
        }
    };
    
    const handleCloseAddStudentDialog = () => {
        setOpenAddStudentDialog(false);
        setSelectedStudents([]);
    };
    
    const handleToggleStudentSelection = (studentId: string) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };
    
    const handleAddStudentsToSubject = async () => {
        if (selectedStudents.length === 0) {
            setSnackbarMessage('Виберіть хоча б одного учня');
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
            return;
        }
        
        try {
            // Відправляємо запит на сервер для додавання учнів до предмету
            await API.post(`/subject/${subjectId}/add-students`, {
                studentIds: selectedStudents
            });
            
            // Оновлюємо дані предмету, щоб відобразити нових учнів
            const updatedSubjectData = await getSubjectById(subjectId || '');
            setSubject(updatedSubjectData);
            
            setSnackbarMessage('Учнів успішно додано до предмету');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            handleCloseAddStudentDialog();
        } catch (error) {
            console.error('Error adding students to subject:', error);
            setSnackbarMessage('Помилка при додаванні учнів до предмету');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    if (loading) {
        return <Container><Typography>Завантаження...</Typography></Container>;
    }

    if (!subject) {
        return <Container><Typography>Предмет не знайдено</Typography></Container>;
    }
    console.log(tasks);
    
    return (
        <Container>
            <audio ref={audioRef} />
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h1" component="h1" gutterBottom>
                        {subject.name}
                    </Typography>
                    {isStudent && (
                        <VolumeUpIcon 
                            color="primary" 
                            onClick={() => playAudio(`/audio/subject-${subject.name.toLowerCase().replace(/\s+/g, '-')}.mp3`)}
                            sx={{ ml: 2, cursor: 'pointer' }}
                        />
                    )}
                </Box>
            
                
                {isTeacher && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{ mt: 2 }}
                    >
                        Додати завдання
                    </Button>
                )}
            </Box>
            
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="subject tabs">
                        <Tab label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <span>Завдання</span>
                                {isStudent && (
                                    <VolumeUpIcon 
                                        color="primary" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playAudio('/audio/tasks.mp3');
                                        }}
                                        sx={{ ml: 1, fontSize: '1rem' }}
                                    />
                                )}
                            </Box>
                        } />
                        <Tab label="Учні" />
                        <Tab label="Інформація" />
                    </Tabs>
                </Box>
                
                <TabPanel value={tabValue} index={0}>
                    {tasks.length > 0 ? (
                        <List>
                            {tasks.map((task) => (
                                <Card key={task._id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="h6" component="h2">
                                                    {task.name}
                                                </Typography>
                                                {isStudent && (
                                                    <VolumeUpIcon 
                                                        color="primary" 
                                                        onClick={() => playAudio(`/audio/task-${task.name.toLowerCase().replace(/\s+/g, '-')}.mp3`)}
                                                        sx={{ ml: 1, cursor: 'pointer' }}
                                                    />
                                                )}
                                                {isStudent && completedTasks.includes(task._id) && (
                                                    <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                                                )}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {isTeacher && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        component={Link}
                                                        to={`/tasks/${task._id}/responses`}
                                                        sx={{ mr: 2 }}
                                                        endIcon={
                                                            taskResponsesCount[task._id] ? (
                                                                <Chip 
                                                                    size="small" 
                                                                    label={taskResponsesCount[task._id]} 
                                                                    color="primary" 
                                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                                />
                                                            ) : (
                                                                <ForumIcon fontSize="small" />
                                                            )
                                                        }
                                                    >
                                                        Відповіді учнів
                                                    </Button>
                                                )}
                                                <IconButton onClick={() => toggleTaskExpand(task._id)}>
                                                    {expandedTasks[task._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {task.description}
                                        </Typography>
                                        
                                        <Collapse in={expandedTasks[task._id]}>
                                            {/* Текстове вкладення */}
                                            {task?.attachments?.find((a: { type: string }) => a.type === 'text') && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="body1">
                                                        <MuiLink 
                                                            href={task.attachments.find((a: { type: string; url: string }) => a.type === 'text')?.url || ''} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                        >
                                                            {task.attachments.find((a: { type: string; title?: string }) => a.type === 'text')?.title || 'Відкрити текстовий матеріал'}
                                                        </MuiLink>
                                                    </Typography>
                                                </Box>
                                            )}
                                            
                                            {/* Відео вкладення */}
                                            {task?.attachments?.find((a: { type: string }) => a.type === 'video') && (
                                                <Box sx={{ mt: 2 }}>
                                                    <iframe
                                                        width="100%"
                                                        height="315"
                                                        src={task.attachments.find((a: { type: string; url: string }) => a.type === 'video')?.url}
                                                        title="Video"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </Box>
                                            )}
                                            
                                            {/* Зображення */}
                                            {task?.attachments?.filter((a: { type: string }) => a.type === 'image').length > 0 && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Grid container spacing={2}>
                                                        {task?.attachments?.filter((a: { type: string }) => a.type === 'image').map((image: { url: string; title?: string }, index: number) => (
                                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                                <img 
                                                                    src={image.url} 
                                                                    alt={image.title || `Image ${index + 1}`} 
                                                                    style={{ width: '100%', borderRadius: '4px' }}
                                                                />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            )}
                                            
                                            {/* Міні-гра */}
                                            {task?.attachments?.find((a: { type: string }) => a.type === 'game') && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Інтерактивне завдання:
                                                    </Typography>
                                                    <iframe
                                                        src={task.attachments.find((a: { type: string; url: string }) => a.type === 'game')?.url}
                                                        width="100%"
                                                        height="500"
                                                        frameBorder="0"
                                                        allowFullScreen
                                                    ></iframe>
                                                </Box>
                                            )}
                                            
                                            {isStudent && (
                                                <Box sx={{ mt: 3 }}>
                                                    <Divider sx={{ mb: 2 }} />
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Відповідь на завдання:
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={4}
                                                        placeholder="Введіть вашу відповідь тут..."
                                                        value={taskResponses[task._id] || ''}
                                                        onChange={(e) => handleTaskResponseChange(task._id, e.target.value)}
                                                        disabled={completedTasks.includes(task._id)}
                                                        sx={{ mb: 2 }}
                                                    />
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            endIcon={<SendIcon />}
                                                            onClick={() => handleSubmitTaskResponse(task._id)}
                                                            disabled={completedTasks.includes(task._id) || submittingTask === task._id}
                                                        >
                                                            {submittingTask === task._id ? (
                                                                <CircularProgress size={24} color="inherit" />
                                                            ) : completedTasks.includes(task._id) ? (
                                                                'Виконано'
                                                            ) : (
                                                                'Відправити'
                                                            )}
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Collapse>
                                    </CardContent>
                                </Card>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Поки що немає завдань для цього предмету.
                        </Typography>
                    )}
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">
                            Список учнів
                        </Typography>
                        {isTeacher && (
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<PersonAddIcon />}
                                onClick={handleOpenAddStudentDialog}
                            >
                                Додати учнів
                            </Button>
                        )}
                    </Box>
                    
                    {subject.students && subject.students.length > 0 ? (
                        <Grid container spacing={2}>
                            {subject.students.map((student: any) => (
                                <Grid item xs={12} sm={6} md={4} key={student._id}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6" component="div" gutterBottom>
                                                {student.username || 'Невідомий учень'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Email: {student.email || 'Не вказано'}
                                            </Typography>
                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                {isTeacher && (
                                                    <Button 
                                                        size="small" 
                                                        variant="outlined"
                                                        onClick={() => {
                                                            // Тут можна додати функціонал для вчителя, наприклад, перегляд оцінок учня
                                                            console.log('View student details:', student);
                                                            setSnackbarMessage('Функція буде доступна незабаром!');
                                                            setSnackbarSeverity('info');
                                                            setOpenSnackbar(true);
                                                        }}
                                                    >
                                                        Деталі
                                                    </Button>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                            На цей предмет ще не записався жоден учень.
                        </Typography>
                    )}
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" gutterBottom>
                        Інформація про предмет
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {subject.description}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Розклад занять:
                    </Typography>
                    <List>
                        {subject.time && subject.time.map((timeSlot: string, index: number) => (
                            <ListItem key={index}>
                                <ListItemText primary={timeSlot} />
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
            </Box>
            
            {/* Діалог для створення нового завдання */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogContent>
                    {subjectId && (
                        <TaskForm 
                            addTask={(task) => {
                                setTasks([task, ...tasks]);
                                handleCloseDialog();
                                setSnackbarMessage('Завдання успішно створено!');
                                setSnackbarSeverity('success');
                                setOpenSnackbar(true);
                            }} 
                            taskId={subjectId} 
                        />
                    )}
                </DialogContent>
            </Dialog>
            
            {/* Діалог для додавання учнів до предмету */}
            <Dialog 
                open={openAddStudentDialog} 
                onClose={handleCloseAddStudentDialog}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Додати учнів до предмету</DialogTitle>
                <DialogContent>
                    {loadingStudents ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : availableStudents.length > 0 ? (
                        <List>
                            {availableStudents.map(student => (
                                <ListItem 
                                    key={student._id}
                                    button
                                    onClick={() => handleToggleStudentSelection(student._id)}
                                >
                                    <ListItemText 
                                        primary={`${student.firstName} ${student.lastName}`} 
                                        secondary={student.email} 
                                    />
                                    <Checkbox 
                                        edge="end"
                                        checked={selectedStudents.includes(student._id)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{ p: 2 }}>
                            Немає доступних учнів для додавання до цього предмету.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddStudentDialog}>Скасувати</Button>
                    <Button 
                        onClick={handleAddStudentsToSubject} 
                        variant="contained" 
                        color="primary"
                        disabled={selectedStudents.length === 0}
                    >
                        Додати вибраних
                    </Button>
                </DialogActions>
            </Dialog>
            
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
        </Container>
    );
};

export default SubjectDetails; 