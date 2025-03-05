import React, { useState, useEffect, useRef } from 'react';
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
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Tooltip,
    Button
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getStudentGrades } from '../../services/api/gradesApi';
import { getStudentSubjects } from '../../services/api/subjectsApi';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../utils/AppRoutes';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AddIcon from '@mui/icons-material/Add';

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

const StudentGrades = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [grades, setGrades] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch only subjects that the student has joined
            if (user?._id) {
                const subjectsData = await getStudentSubjects(user._id);
                setSubjects(subjectsData);

                // Fetch student grades
                const gradesData = await getStudentGrades(user._id);
                setGrades(gradesData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Помилка при завантаженні даних');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const navigateToJoinSubject = () => {
        navigate(AppRoutes.JOIN_SUBJECT);
    };

    const playAudio = (audioSrc: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioSrc;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    // Filter grades by subject
    const getSubjectGrades = (subjectId: string) => {
        return grades.filter(grade => grade.subject._id === subjectId);
    };

    // Group grades by task
    const groupGradesByTask = (subjectGrades: any[]) => {
        const taskMap = new Map();
        
        subjectGrades.forEach(grade => {
            if (!taskMap.has(grade.task._id)) {
                taskMap.set(grade.task._id, {
                    taskId: grade.task._id,
                    taskName: grade.task.name,
                    taskDescription: grade.task.description || '',
                    grade: grade.grade,
                    date: new Date(grade.createdAt),
                    gradeId: grade._id
                });
            } else {
                // If there are multiple grades for the same task, keep the most recent one
                const existingGrade = taskMap.get(grade.task._id);
                const newGradeDate = new Date(grade.createdAt);
                
                if (newGradeDate > existingGrade.date) {
                    taskMap.set(grade.task._id, {
                        taskId: grade.task._id,
                        taskName: grade.task.name,
                        taskDescription: grade.task.description || '',
                        grade: grade.grade,
                        date: newGradeDate,
                        gradeId: grade._id
                    });
                }
            }
        });
        
        return Array.from(taskMap.values());
    };

    return (
        <Container maxWidth="lg">
            <audio ref={audioRef} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Мої оцінки
                    </Typography>
                    <VolumeUpIcon 
                        color="primary" 
                        onClick={() => playAudio('/audio/my-grades.mp3')}
                        sx={{ ml: 2, cursor: 'pointer' }}
                    />
                </Box>
                {subjects.length === 0 && (
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

            {subjects.length === 0 ? (
                <Alert severity="info">
                    У вас поки немає предметів. Приєднайтесь до предмету, щоб побачити оцінки.
                </Alert>
            ) : (
                <>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange} 
                            aria-label="subject tabs"
                            variant="scrollable"
                            scrollButtons="auto"
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
                            <Typography variant="h5" gutterBottom>
                                {subject.name}
                            </Typography>

                            {getSubjectGrades(subject._id).length === 0 ? (
                                <Alert severity="info">
                                    У вас поки немає оцінок з цього предмету.
                                </Alert>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Завдання</TableCell>
                                                <TableCell>Опис</TableCell>
                                                <TableCell align="center">Оцінка</TableCell>
                                                <TableCell>Дата</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {groupGradesByTask(getSubjectGrades(subject._id)).map((gradeInfo) => (
                                                <TableRow key={gradeInfo.gradeId} hover>
                                                    <TableCell>{gradeInfo.taskName}</TableCell>
                                                    <TableCell>
                                                        {gradeInfo.taskDescription.length > 100 
                                                            ? `${gradeInfo.taskDescription.substring(0, 100)}...` 
                                                            : gradeInfo.taskDescription}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title={getGradeText(gradeInfo.grade)} arrow>
                                                            {getGradeIcon(gradeInfo.grade)}
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell>
                                                        {gradeInfo.date.toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </TabPanel>
                    ))}
                </>
            )}
        </Container>
    );
};

export default StudentGrades; 