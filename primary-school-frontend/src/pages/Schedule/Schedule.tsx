import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Grid, 
    Button, 
    TextField, 
    MenuItem, 
    IconButton, 
    Snackbar, 
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../hooks/useAuth';
import { getSubjects, getSubjectsByTeacher } from '../../services/api/subjectsApi';
import { getSchedule, updateSchedule } from '../../services/api/scheduleApi';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = [
    { id: 1, name: 'Понеділок' },
    { id: 2, name: 'Вівторок' },
    { id: 3, name: 'Середа' },
    { id: 4, name: 'Четвер' },
    { id: 5, name: "П'ятниця" }
];

const timeSlots = [
    '08:30-09:15',
    '09:25-10:10',
    '10:20-11:05',
    '11:15-12:00',
    '12:10-12:55',
    '13:05-13:50',
    '14:00-14:45'
];

interface ScheduleItem {
    _id?: string;
    subject: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

interface Subject {
    _id: string;
    name: string;
    description?: string;
}

const Schedule = () => {
    const { user, loading: userLoading } = useAuth();
    const isTeacher = user?.role === 'teacher';
    const isStudent = user?.role === 'student';
    console.log(user);
    
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
    const [newItem, setNewItem] = useState<ScheduleItem>({
        subject: '',
        dayOfWeek: 1,
        startTime: '08:30',
        endTime: '09:15'
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading) {
            fetchData();
        }
    }, [userLoading, user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Отримуємо предмети
            let subjectsData: Subject[] = [];
            
            try {
                if (isTeacher && user?._id) {
                    // Для вчителя отримуємо його предмети
                    subjectsData = await getSubjectsByTeacher(user._id);
                } else {
                    // Для студента отримуємо всі предмети
                    subjectsData = await getSubjects();
                }
                
                console.log('Subjects data:', subjectsData);
                
                // Не встановлюємо помилку, якщо немає предметів, просто логуємо це
                if (!subjectsData || subjectsData.length === 0) {
                    console.log('No subjects found');
                }
            } catch (subjectsError) {
                console.error('Error fetching subjects:', subjectsError);
                setError('Помилка при завантаженні предметів');
            }
            
            setSubjects(subjectsData || []);
            
            // Отримуємо розклад
            try {
                const scheduleData = await getSchedule();
                console.log('Schedule data:', scheduleData);
                if (scheduleData && scheduleData.items) {
                    setScheduleItems(scheduleData.items);
                }
            } catch (error) {
                console.log('Розклад ще не створено або помилка при отриманні:', error);
                // Не встановлюємо помилку, оскільки це може бути нормальною ситуацією
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Помилка при завантаженні даних');
            setSnackbarMessage('Помилка при завантаженні даних');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (item?: ScheduleItem) => {
        if (item) {
            setEditingItem(item);
            setNewItem(item);
        } else {
            setEditingItem(null);
            // Перевіряємо, чи є предмети перед встановленням значення за замовчуванням
            const defaultSubject = subjects.length > 0 ? subjects[0]._id : '';
            console.log('Default subject:', defaultSubject);
            console.log('Available subjects:', subjects);
            setNewItem({
                subject: defaultSubject,
                dayOfWeek: 1,
                startTime: '08:30',
                endTime: '09:15'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingItem(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string | number>) => {
        const { name, value } = e.target;
        setNewItem({
            ...newItem,
            [name as string]: value
        });
    };

    const handleTimeSlotSelect = (timeSlot: string) => {
        const [start, end] = timeSlot.split('-');
        setNewItem({
            ...newItem,
            startTime: start,
            endTime: end
        });
    };

    const handleSaveItem = async () => {
        try {
            // Перевірка на заповнення всіх полів
            if (!newItem.subject || !newItem.dayOfWeek || !newItem.startTime || !newItem.endTime) {
                setSnackbarMessage('Будь ласка, заповніть всі поля');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                return;
            }
            
            let updatedItems;
            
            if (editingItem && editingItem._id) {
                // Оновлюємо існуючий елемент
                updatedItems = scheduleItems.map(item => 
                    item._id === editingItem._id ? newItem : item
                );
            } else {
                // Додаємо новий елемент
                updatedItems = [...scheduleItems, newItem];
            }
            
            // Зберігаємо розклад на сервері
            await updateSchedule({ items: updatedItems });
            
            setScheduleItems(updatedItems);
            setSnackbarMessage(editingItem ? 'Урок оновлено' : 'Урок додано до розкладу');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving schedule item:', error);
            setSnackbarMessage('Помилка при збереженні розкладу');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            const updatedItems = scheduleItems.filter(item => item._id !== itemId);
            
            // Зберігаємо розклад на сервері
            await updateSchedule({ items: updatedItems });
            
            setScheduleItems(updatedItems);
            setSnackbarMessage('Урок видалено з розкладу');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error deleting schedule item:', error);
            setSnackbarMessage('Помилка при видаленні уроку');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

  

    const getDayName = (dayId: number) => {
        const day = daysOfWeek.find(d => d.id === dayId);
        return day ? day.name : 'Невідомий день';
    };

    if (userLoading || loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                    <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
                        {error}
                    </Alert>
                    {isTeacher && (
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => navigate('/subjects')}
                        >
                            Перейти до предметів
                        </Button>
                    )}
                </Box>
            </Container>
        );
    }

    // Перевіряємо, чи є предмети для створення розкладу
    if (isTeacher && subjects.length === 0) {
        return (
            <Container>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                        Тижневий розклад
                    </Typography>
                    <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
                        Спочатку створіть хоча б один предмет, щоб мати можливість скласти розклад
                    </Alert>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate('/subjects')}
                    >
                        Перейти до предметів
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Тижневий розклад
                </Typography>
                {isTeacher && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        disabled={subjects.length === 0}
                    >
                        Додати урок
                    </Button>
                )}
            </Box>

            {scheduleItems.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">
                        {isTeacher 
                            ? 'Натисніть кнопку "Додати урок", щоб створити розклад'
                            : 'Розклад ще не створено. Зверніться до вчителя.'}
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>День</TableCell>
                                <TableCell>Час</TableCell>
                                <TableCell>Предмет</TableCell>
                                {isTeacher && <TableCell align="right">Дії</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scheduleItems
                                .sort((a, b) => {
                                    // Сортуємо за днем тижня, а потім за часом початку
                                    if (a.dayOfWeek !== b.dayOfWeek) {
                                        return a.dayOfWeek - b.dayOfWeek;
                                    }
                                    return a.startTime.localeCompare(b.startTime);
                                })
                                .map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{getDayName(item.dayOfWeek)}</TableCell>
                                        <TableCell>{`${item.startTime}-${item.endTime}`}</TableCell>
                                        <TableCell>{item.subject.name}</TableCell>
                                        {isTeacher && (
                                            <TableCell align="right">
                                                <IconButton 
                                                    color="primary" 
                                                    onClick={() => handleOpenDialog(item)}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => item._id && handleDeleteItem(item._id)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? 'Редагувати урок' : 'Додати урок'}</DialogTitle>
                <DialogContent>
                    {subjects.length === 0 ? (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Спочатку створіть хоча б один предмет, щоб мати можливість скласти розклад.
                            <Button 
                                color="primary" 
                                size="small" 
                                sx={{ mt: 1, display: 'block' }}
                                onClick={() => {
                                    handleCloseDialog();
                                    navigate('/subjects');
                                }}
                            >
                                Перейти до предметів
                            </Button>
                        </Alert>
                    ) : (
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="subject-label">Предмет</InputLabel>
                                <Select
                                    labelId="subject-label"
                                    name="subject"
                                    value={newItem.subject}
                                    onChange={handleInputChange as (event: SelectChangeEvent<string>, child: React.ReactNode) => void}
                                    label="Предмет"
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject._id} value={subject._id}>
                                            {subject.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="day-label">День тижня</InputLabel>
                                <Select
                                    labelId="day-label"
                                    name="dayOfWeek"
                                    value={newItem.dayOfWeek}
                                    onChange={handleInputChange as (event: SelectChangeEvent<number>, child: React.ReactNode) => void}
                                    label="День тижня"
                                >
                                    {daysOfWeek.map((day) => (
                                        <MenuItem key={day.id} value={day.id}>
                                            {day.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="time-label">Час</InputLabel>
                                <Select
                                    labelId="time-label"
                                    value={`${newItem.startTime}-${newItem.endTime}`}
                                    onChange={(e) => handleTimeSlotSelect(e.target.value as string)}
                                    label="Час"
                                >
                                    {timeSlots.map((slot) => (
                                        <MenuItem key={slot} value={slot}>
                                            {slot}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Скасувати</Button>
                    <Button 
                        onClick={handleSaveItem} 
                        variant="contained" 
                        color="primary"
                        disabled={subjects.length === 0 || !newItem.subject || !newItem.dayOfWeek || !newItem.startTime || !newItem.endTime}
                    >
                        {editingItem ? 'Оновити' : 'Додати'}
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

export default Schedule;
