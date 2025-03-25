import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Divider,
    Grid,
    Collapse,
    IconButton,
    TextField,
    Button,
    Snackbar,
    Link
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getSubjects } from '../../services/api/subjectsApi';
import { getStudentSubjects } from '../../services/api/subjectsApi';
import { API } from '../../services';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Confetti from 'react-confetti';

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
            id={`subject-tabpanel-${index}`}
            aria-labelledby={`subject-tab-${index}`}
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

const StudentTasks = () => {
    const { user } = useAuth();
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const [subjects, setSubjects] = useState<any[]>([]);
    const [tasks, setTasks] = useState<Record<string, any[]>>({});
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
    const [taskResponses, setTaskResponses] = useState<Record<string, string>>({});
    const [submittingTask, setSubmittingTask] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch subjects that the student has joined
            const subjectsData = await getStudentSubjects(user?._id || '');
            setSubjects(subjectsData);
            
            // Initialize tasks state
            const tasksObj: Record<string, any[]> = {};
            
            // Fetch tasks for each subject
            for (const subject of subjectsData) {
                try {
                    const response = await API.get(`/tasks/subject/${subject._id}`);
                    tasksObj[subject._id] = response.data;
                    
                    // Initialize expanded state for all tasks
                    response.data.forEach((task: any) => {
                        setExpandedTasks(prev => ({
                            ...prev,
                            [task._id]: false
                        }));
                    });
                } catch (err) {
                    console.error(`Error fetching tasks for subject ${subject.name}:`, err);
                }
            }
            
            setTasks(tasksObj);
            
            // Fetch completed tasks
            try {
                const response = await API.get(`/tasks/completed?studentId=${user?._id}`);
                setCompletedTasks(response.data.map((task: any) => task.taskId));
            } catch (err) {
                console.error('Error fetching completed tasks:', err);
            }
            
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Помилка при завантаженні даних');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
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

    const handleSubmitTaskResponse = async (taskId: string, subjectId: string) => {
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

    if (loading) {
        return (
            <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <audio ref={audioRef} />
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Мої завдання
                </Typography>
                <VolumeUpIcon 
                    color="primary" 
                    onClick={() => playAudio('/audio/my-tasks.mp3')}
                    sx={{ ml: 2, cursor: 'pointer' }}
                />
            </Box>
            
            {subjects.length > 0 ? (
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange} 
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="subject tabs"
                        >
                            {subjects.map((subject, index) => (
                                <Tab 
                                    key={subject._id} 
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <span>{subject.name}</span>
                                            <VolumeUpIcon 
                                                color="primary" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    playAudio(`/audio/subject-${subject.name.toLowerCase().replace(/\s+/g, '-')}.mp3`);
                                                }}
                                                sx={{ ml: 1, fontSize: '1rem' }}
                                            />
                                        </Box>
                                    } 
                                />
                            ))}
                        </Tabs>
                    </Box>
                    
                    {subjects.map((subject, index) => (
                        <TabPanel key={subject._id} value={tabValue} index={index}>
                            <Typography variant="h6" gutterBottom>
                                Завдання з предмету: {subject.name}
                            </Typography>
                            
                            {tasks[subject._id]?.length > 0 ? (
                                tasks[subject._id].map((task) => (
                                    <Card key={task._id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant="h6" component="h2">
                                                        {task.name}
                                                    </Typography>
                                                    <VolumeUpIcon 
                                                        color="primary" 
                                                        onClick={() => playAudio(`/audio/task-${task.name.toLowerCase().replace(/\s+/g, '-')}.mp3`)}
                                                        sx={{ ml: 1, cursor: 'pointer' }}
                                                    />
                                                    {completedTasks.includes(task._id) && (
                                                        <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                                                    )}
                                                </Box>
                                                <IconButton onClick={() => toggleTaskExpand(task._id)}>
                                                    {expandedTasks[task._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {task.description}
                                            </Typography>
                                            
                                            <Collapse in={expandedTasks[task._id]}>
                                                {/* Текстове вкладення */}
                                                {task?.attachments?.find((a: { type: string }) => a.type === 'text') && (
                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography variant="body1">
                                                            <Link 
                                                                href={task.attachments.find((a: { type: string; url: string }) => a.type === 'text')?.url || ''} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                            >
                                                                {task.attachments.find((a: { type: string; title?: string }) => a.type === 'text')?.title || 'Відкрити текстовий матеріал'}
                                                            </Link>
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
                                                            onClick={() => handleSubmitTaskResponse(task._id, subject._id)}
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
                                            </Collapse>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Alert severity="info">
                                    Немає завдань для цього предмету
                                </Alert>
                            )}
                        </TabPanel>
                    ))}
                </Box>
            ) : (
                <Alert severity="info">
                    Ви ще не приєдналися до жодного предмету
                </Alert>
            )}
            
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

export default StudentTasks; 