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
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../hooks/useAuth';
import { getSubjectsByTeacher } from '../../services/api/subjectsApi';
import { getSchedule, updateSchedule } from '../../services/api/scheduleApi';

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

const Schedule = () => {
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';
    
    const [subjects, setSubjects] = useState<any[]>([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isTeacher && user?._id) {
                    setLoading(true);
                    
                    // Отримуємо предмети вчителя
                    const subjectsData = await getSubjectsByTeacher(user._id);
                    setSubjects(subjectsData);
                    
                    // Отримуємо розклад
                    try {
                        const scheduleData = await getSchedule();
                        if (scheduleData && scheduleData.items) {
                            setScheduleItems(scheduleData.items);
                        }
                    } catch (error) {
                        console.log('Розклад ще не створено');
                    }
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
    }, [isTeacher, user]);

    const handleOpenDialog = (item?: ScheduleItem) => {
        if (item) {
            setEditingItem(item);
            setNewItem(item);
        } else {
            setEditingItem(null);
            setNewItem({
                subject: subjects.length > 0 ? subjects[0]._id : '',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
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

    const getSubjectNameById = (subjectId: string) => {
        const subject = subjects.find(s => s._id === subjectId);
        return subject ? subject.name : 'Невідомий предмет';
    };

    const getDayName = (dayId: number) => {
        const day = daysOfWeek.find(d => d.id === dayId);
        return day ? day.name : 'Невідомий день';
    };

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!isTeacher) {
        return (
            <Container>
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Доступ до редагування розкладу мають тільки вчителі
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Тижневий розклад
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Додати урок
                </Button>
            </Box>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>День тижня</TableCell>
                            <TableCell>Предмет</TableCell>
                            <TableCell>Час</TableCell>
                            <TableCell align="right">Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scheduleItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="subtitle1" sx={{ py: 2 }}>
                                        Розклад ще не створено. Додайте перший урок.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            scheduleItems
                                .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                                .map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{getDayName(item.dayOfWeek)}</TableCell>
                                        <TableCell>{getSubjectNameById(item.subject)}</TableCell>
                                        <TableCell>{`${item.startTime}-${item.endTime}`}</TableCell>
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
                                                onClick={() => handleDeleteItem(item._id as string)}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingItem ? 'Редагувати урок' : 'Додати новий урок'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="subject-label">Предмет</InputLabel>
                            <Select
                                labelId="subject-label"
                                name="subject"
                                value={newItem.subject}
                                onChange={handleInputChange}
                                label="Предмет"
                            >
                                {subjects.map((subject) => (
                                    <MenuItem key={subject._id} value={subject._id}>
                                        {subject.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="day-label">День тижня</InputLabel>
                            <Select
                                labelId="day-label"
                                name="dayOfWeek"
                                value={newItem.dayOfWeek}
                                onChange={handleInputChange}
                                label="День тижня"
                            >
                                {daysOfWeek.map((day) => (
                                    <MenuItem key={day.id} value={day.id}>
                                        {day.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <Typography variant="subtitle1" gutterBottom>
                            Виберіть час уроку:
                        </Typography>
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            {timeSlots.map((timeSlot) => (
                                <Grid item key={timeSlot}>
                                    <Button
                                        variant={`${timeSlot.split('-')[0] === newItem.startTime && timeSlot.split('-')[1] === newItem.endTime ? 'contained' : 'outlined'}`}
                                        onClick={() => handleTimeSlotSelect(timeSlot)}
                                        size="small"
                                    >
                                        {timeSlot}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    name="startTime"
                                    label="Початок"
                                    type="time"
                                    value={newItem.startTime}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 хвилин
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    name="endTime"
                                    label="Кінець"
                                    type="time"
                                    value={newItem.endTime}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 хвилин
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Скасувати</Button>
                    <Button 
                        onClick={handleSaveItem} 
                        variant="contained" 
                        color="primary"
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
