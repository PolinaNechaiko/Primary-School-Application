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
    Alert
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
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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
            const taskData: any = {
                name: title,
                description,
                subjectId: taskId,
                content: {
                    text: '',
                    video: '',
                    images: [] as string[],
                    learningApp: ''
                },
                attachments: attachments.length > 0 ? attachments : undefined
            };
            
            // Перетворюємо вкладення в контент
            attachments.forEach(attachment => {
                if (attachment.type === 'video') {
                    taskData.content.video = attachment.url;
                } else if (attachment.type === 'image') {
                    taskData.content.images.push(attachment.url);
                } else if (attachment.type === 'text') {
                    taskData.content.text = attachment.url;
                } else if (attachment.type === 'game') {
                    taskData.content.learningApp = attachment.url;
                }
            });
            
            const createdTask = await createTask(taskData);
            
            const newTask: ITask = {
                _id: createdTask.task._id,
                name: title,
                descriptions: description,
                attachments: attachments.length > 0 ? attachments : undefined
            };
            
            addTask(newTask);
            setTitle('');
            setDescription('');
            setAttachments([]);
            setSnackbarMessage('Завдання успішно створено');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error creating task:', error);
            setSnackbarMessage('Помилка при створенні завдання');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
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
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Додати нове вкладення
                        </Typography>
                        
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton 
                                        color={attachmentType === 'image' ? 'primary' : 'default'} 
                                        onClick={() => handleAttachmentTypeChange('image')}
                                    >
                                        <ImageIcon />
                                    </IconButton>
                                    <IconButton 
                                        color={attachmentType === 'video' ? 'primary' : 'default'} 
                                        onClick={() => handleAttachmentTypeChange('video')}
                                    >
                                        <VideoLibraryIcon />
                                    </IconButton>
                                    <IconButton 
                                        color={attachmentType === 'text' ? 'primary' : 'default'} 
                                        onClick={() => handleAttachmentTypeChange('text')}
                                    >
                                        <TextSnippetIcon />
                                    </IconButton>
                                    <IconButton 
                                        color={attachmentType === 'game' ? 'primary' : 'default'} 
                                        onClick={() => handleAttachmentTypeChange('game')}
                                    >
                                        <SportsEsportsIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Назва (необов'язково)"
                                    fullWidth
                                    value={attachmentTitle}
                                    onChange={(e) => setAttachmentTitle(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
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
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddIcon />}
                                    onClick={handleAddAttachment}
                                    fullWidth
                                >
                                    Додати
                                </Button>
                            </Grid>
                        </Grid>
                        
                        {attachmentType === 'game' && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                Для додавання міні-гри використовуйте посилання з сайту LearningApps.org
                            </Typography>
                        )}
                    </Paper>
                    
                    {attachments.length > 0 && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Додані вкладення:
                            </Typography>
                            
                            {attachments.map((attachment, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {getAttachmentTypeIcon(attachment.type)}
                                        <Typography sx={{ ml: 2 }}>
                                            {attachment.title || `${attachment.type === 'image' ? 'Зображення' : attachment.type === 'video' ? 'Відео' : attachment.type === 'text' ? 'Текст' : 'Міні-гра'} ${index + 1}`}
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={() => handleRemoveAttachment(index)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    sx={{ height: '40px', width: '250px' }} 
                    variant='contained' 
                    onClick={handleSubmit}
                >
                    Створити завдання
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
