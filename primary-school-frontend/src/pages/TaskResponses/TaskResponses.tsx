import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Chip,
    Breadcrumbs
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getTaskResponses, updateTaskFeedback, getTaskById } from '../../services/api/tasksApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

interface CompletedTask {
    _id: string;
    taskId: string;
    subjectId: string;
    studentId: {
        _id: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    response: string;
    completedAt: string;
    feedback: string | null;
    grade: string | null;
}

const gradeOptions = ['excellent', 'good', 'satisfactory', 'poor'];

const TaskResponses: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [task, setTask] = useState<any>(null);
    const [responses, setResponses] = useState<CompletedTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Стан для діалогу оцінювання
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<CompletedTask | null>(null);
    const [feedback, setFeedback] = useState('');
    const [grade, setGrade] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    // Стан для сповіщень
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    
    useEffect(() => {
        if (!user || user.role !== 'teacher') {
            setError('Доступ заборонено. Тільки вчителі можуть переглядати цю сторінку.');
            setLoading(false);
            return;
        }
        
        fetchResponses();
    }, [taskId, user]);
    
    const fetchResponses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!taskId) {
                setError('ID завдання не вказано');
                setLoading(false);
                return;
            }
            
            try {
                // Отримуємо інформацію про завдання
                const taskData = await getTaskById(taskId);
                setTask(taskData);
                
                // Отримуємо відповіді на завдання
                const responsesData = await getTaskResponses(taskId);
                console.log('Received responses:', responsesData);
                setResponses(responsesData);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Помилка при завантаженні даних');
            } finally {
                setLoading(false);
            }
        } catch (err) {
            console.error('Error in fetchResponses:', err);
            setError('Помилка при завантаженні даних');
            setLoading(false);
        }
    };
    
    const handleOpenDialog = (response: CompletedTask) => {
        setSelectedResponse(response);
        setFeedback(response.feedback || '');
        setGrade(response.grade || '');
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedResponse(null);
    };
    
    const handleSubmitFeedback = async () => {
        if (!selectedResponse) return;
        
        try {
            setSubmitting(true);
            
            const result = await updateTaskFeedback(
                selectedResponse._id,
                feedback,
                grade
            );
            
            // Оновлюємо локальний стан
            setResponses(responses.map(response => 
                response._id === selectedResponse._id 
                    ? { ...response, feedback, grade } 
                    : response
            ));
            
            setSnackbarMessage('Відгук та оцінка збережені успішно');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            
            handleCloseDialog();
        } catch (err) {
            console.error('Error updating feedback:', err);
            setSnackbarMessage('Помилка при збереженні відгуку та оцінки');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleGoBack = () => {
        navigate(-1);
    };
    
    const formatDate = (dateString: string) => {
        // Спрощуємо форматування дати без бібліотек
        const date = new Date(dateString);
        return date.toLocaleString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                return grade;
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
            <Box sx={{ mb: 4 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={handleGoBack}
                    sx={{ mb: 2 }}
                >
                    Назад
                </Button>
                
                <Breadcrumbs 
                    separator={<NavigateNextIcon fontSize="small" />} 
                    aria-label="breadcrumb"
                    sx={{ mb: 2 }}
                >
                    <Link to="/subjects">Предмети</Link>
                    <Typography color="text.primary">Відповіді на завдання</Typography>
                </Breadcrumbs>
                
                <Typography variant="h4" component="h1" gutterBottom>
                    Відповіді на завдання
                </Typography>
                
                {task && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            {task.name}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {task.description}
                        </Typography>
                    </Paper>
                )}
                
                {responses.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Учень</TableCell>
                                    <TableCell>Відповідь</TableCell>
                                    <TableCell>Дата відправлення</TableCell>
                                    <TableCell>Оцінка</TableCell>
                                    <TableCell>Відгук</TableCell>
                                    <TableCell>Дії</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {responses.map((response) => (
                                    <TableRow key={response._id}>
                                        <TableCell>
                                            {response.studentId.firstName} {response.studentId.lastName}
                                            <Typography variant="caption" display="block">
                                                {response.studentId.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    maxHeight: '100px', 
                                                    overflowY: 'auto',
                                                    whiteSpace: 'pre-wrap'
                                                }}
                                            >
                                                {response.response}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(response.completedAt)}
                                        </TableCell>
                                        <TableCell>
                                            {response.grade ? (
                                                <Chip 
                                                    label={getGradeText(response.grade)} 
                                                    color={
                                                        response.grade === 'excellent' ? 'success' :
                                                        response.grade === 'good' ? 'primary' :
                                                        response.grade === 'satisfactory' ? 'info' :
                                                        'warning'
                                                    }
                                                />
                                            ) : (
                                                <Chip label="Не оцінено" variant="outlined" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {response.feedback ? (
                                                <Typography variant="body2">
                                                    {response.feedback}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    Немає відгуку
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => handleOpenDialog(response)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info">
                        Поки що немає відповідей на це завдання.
                    </Alert>
                )}
            </Box>
            
            {/* Діалог для оцінювання відповіді */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    Оцінювання відповіді учня
                </DialogTitle>
                
                <DialogContent dividers>
                    {selectedResponse && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Учень: {selectedResponse.studentId.firstName} {selectedResponse.studentId.lastName}
                            </Typography>
                            
                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                Відповідь учня:
                            </Typography>
                            
                            <Paper variant="outlined" sx={{ p: 2, my: 2, bgcolor: 'background.default' }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedResponse.response}
                                </Typography>
                            </Paper>
                            
                            <FormControl fullWidth sx={{ mt: 3, mb: 2 }}>
                                <InputLabel>Оцінка</InputLabel>
                                <Select
                                    value={grade}
                                    label="Оцінка"
                                    onChange={(e) => setGrade(e.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Не оцінено</em>
                                    </MenuItem>
                                    {gradeOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {getGradeText(option)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <TextField
                                label="Відгук для учня"
                                multiline
                                rows={4}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                fullWidth
                                variant="outlined"
                                placeholder="Напишіть свій відгук на роботу учня..."
                            />
                        </>
                    )}
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Скасувати</Button>
                    <Button 
                        onClick={handleSubmitFeedback} 
                        variant="contained" 
                        color="primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Збереження...' : 'Зберегти'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Сповіщення */}
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

export default TaskResponses; 