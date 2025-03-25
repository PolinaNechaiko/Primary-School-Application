import React, {useState} from 'react';
import {
    Box, 
    Button, 
    Typography, 
    Tabs, 
    Tab, 
    TextField, 
    IconButton, 
    Grid, 
    Paper, 
    Divider,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction
} from '@mui/material';
import {ITask, ITaskCreate} from "../../interfaces/Task.ts";
import {FormTextField} from "../FormTextField/FormTextField.tsx";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { createTask } from '../../services/api/tasksApi';

interface TaskFormProps {
    addTask: (task: ITask) => void;
    taskId: string | null;
}

interface Attachment {
    type: 'video' | 'image' | 'text' | 'game';
    url: string;
    title?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({addTask, taskId}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [attachmentType, setAttachmentType] = useState<'video' | 'image' | 'text' | 'game'>('image');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [attachmentTitle, setAttachmentTitle] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleAttachmentTypeChange = (type: 'video' | 'image' | 'text' | 'game') => {
        setAttachmentType(type);
    };

    const handleAddAttachment = () => {
        if (!attachmentUrl) {
            setSnackbarMessage('Будь ласка, введіть URL вкладення');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const newAttachment: Attachment = {
            type: attachmentType,
            url: attachmentUrl,
            title: attachmentTitle || undefined
        };

        setAttachments([...attachments, newAttachment]);
        setAttachmentUrl('');
        setAttachmentTitle('');
        setSnackbarMessage('Вкладення додано');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleRemoveAttachment = (index: number) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    };

    const handleSubmit = async () => {
        if (!title || !description || !taskId) {
            setSnackbarMessage('Будь ласка, заповніть назву та опис завдання');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        
        try {
            setIsSubmitting(true);
            console.log('Submitting task with attachments:', attachments);
            
            // Створюємо об'єкт з даними завдання
            const taskData = {
                name: title,
                description,
                subjectId: taskId,
                attachments: attachments.length > 0 ? attachments : []
            };
            
            console.log('Sending task data:', taskData);
            const createdTask = await createTask(taskData);
            console.log('Task created successfully:', createdTask);
            
            // Повідомляємо батьківський компонент про створення завдання
            const newTask: ITask = {
                _id: createdTask.task._id,
                name: title,
                descriptions: description,
                attachments: attachments
            };
            
            addTask(newTask);
            
            // Очищаємо форму
            setTitle('');
            setDescription('');
            setAttachments([]);
            
            // Показуємо повідомлення про успіх
            setSnackbarMessage('Завдання успішно створено');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error creating task:', error);
            setSnackbarMessage('Помилка при створенні завдання');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAttachmentTypeIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <ImageIcon />;
            case 'video':
                return <VideoLibraryIcon />;
            case 'text':
                return <TextSnippetIcon />;
            case 'game':
                return <SportsEsportsIcon />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{display: 'flex', gap: 2, flexDirection: 'column', mb: 4}}>
            <Typography variant="h5" component="h2" gutterBottom>
                Створення нового завдання
            </Typography>
            
            <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Основна інформація" />
                <Tab label="Вкладення" />
            </Tabs>
            
            {currentTab === 0 && (
                <Box>
                    <FormTextField
                        label="Назва завдання"
                        inputProps={{
                            id: 'title', 
                            fullWidth: true,
                            value: title,
                            onChange: (e) => setTitle(e.target.value)
                        }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <FormTextField
                            label="Опис завдання"
                            inputProps={{
                                id: 'description',
                                fullWidth: true,
                                multiline: true,
                                rows: 4,
                                value: description,
                                onChange: (e) => setDescription(e.target.value)
                            }}
                        />
                    </Box>
                </Box>
            )}
            
            {currentTab === 1 && (
                <Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Додати нове вкладення
                        </Typography>
                        
                        <Grid container spacing={2}>
                            {/* Тип вкладення */}
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Тип вкладення:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button 
                                        variant={attachmentType === 'image' ? 'contained' : 'outlined'} 
                                        onClick={() => handleAttachmentTypeChange('image')}
                                        startIcon={<ImageIcon />}
                                        size="small"
                                    >
                                        Зображення
                                    </Button>
                                    <Button 
                                        variant={attachmentType === 'video' ? 'contained' : 'outlined'} 
                                        onClick={() => handleAttachmentTypeChange('video')}
                                        startIcon={<VideoLibraryIcon />}
                                        size="small"
                                    >
                                        Відео
                                    </Button>
                                    <Button 
                                        variant={attachmentType === 'text' ? 'contained' : 'outlined'} 
                                        onClick={() => handleAttachmentTypeChange('text')}
                                        startIcon={<TextSnippetIcon />}
                                        size="small"
                                    >
                                        Текст
                                    </Button>
                                    <Button 
                                        variant={attachmentType === 'game' ? 'contained' : 'outlined'} 
                                        onClick={() => handleAttachmentTypeChange('game')}
                                        startIcon={<SportsEsportsIcon />}
                                        size="small"
                                    >
                                        Міні-гра
                                    </Button>
                                </Box>
                            </Grid>
                            
                            {/* Назва вкладення */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Назва вкладення (необов'язково)"
                                    fullWidth
                                    value={attachmentTitle}
                                    onChange={(e) => setAttachmentTitle(e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            
                            {/* URL вкладення */}
                            <Grid item xs={12}>
                                <TextField
                                    label="URL вкладення"
                                    fullWidth
                                    value={attachmentUrl}
                                    onChange={(e) => setAttachmentUrl(e.target.value)}
                                    placeholder={
                                        attachmentType === 'game' 
                                            ? 'https://learningapps.org/...' 
                                            : `URL ${attachmentType === 'image' ? 'зображення' : attachmentType === 'video' ? 'відео' : 'тексту'}`
                                    }
                                    margin="normal"
                                    helperText={
                                        attachmentType === 'game' 
                                            ? 'Для додавання міні-гри використовуйте посилання з сайту LearningApps.org' 
                                            : ''
                                    }
                                />
                            </Grid>
                            
                            {/* Кнопка додавання */}
                            <Grid item xs={12}>
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddIcon />}
                                    onClick={handleAddAttachment}
                                >
                                    Додати вкладення
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    
                    {/* Список вкладень */}
                    {attachments.length > 0 && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Додані вкладення:
                            </Typography>
                            
                            <List>
                                {attachments.map((attachment, index) => (
                                    <ListItem 
                                        key={index}
                                        divider={index !== attachments.length - 1}
                                    >
                                        <ListItemIcon>
                                            {getAttachmentTypeIcon(attachment.type)}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={attachment.title || `${attachment.type === 'image' ? 'Зображення' : attachment.type === 'video' ? 'Відео' : attachment.type === 'text' ? 'Текст' : 'Міні-гра'} ${index + 1}`}
                                            secondary={attachment.url}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton 
                                                edge="end" 
                                                aria-label="delete" 
                                                onClick={() => handleRemoveAttachment(index)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    sx={{ height: '40px', width: '250px' }} 
                    variant='contained' 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Створення...' : 'Створити завдання'}
                </Button>
            </Box>
            
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
        </Box>
    );
};
