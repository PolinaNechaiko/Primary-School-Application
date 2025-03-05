import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
    Box, 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Grid, 
    Card, 
    CardMedia, 
    CardContent, 
    CardActionArea,
    Snackbar,
    Alert,
    styled,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip
} from '@mui/material';
import { AppRoutes } from '../../utils/AppRoutes';
import { createSubject, SubjectData } from '../../services/api/subjectsApi';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Розширений масив доступних обкладинок
const availableCoverImages = [
    { id: 'math', src: 'https://img.freepik.com/free-vector/hand-drawn-mathematics-background_23-2148157511.jpg', alt: 'Математика' },
    { id: 'science', src: 'https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg', alt: 'Природознавство' },
    { id: 'language', src: 'https://img.freepik.com/free-vector/hand-drawn-literature-background_23-2148154120.jpg', alt: 'Українська мова' },
    { id: 'english', src: 'https://img.freepik.com/free-vector/realistic-english-book-composition_1284-37800.jpg', alt: 'Англійська мова' },
    { id: 'history', src: 'https://img.freepik.com/free-vector/hand-drawn-history-background_23-2148161527.jpg', alt: 'Історія' },
    { id: 'geography', src: 'https://img.freepik.com/free-vector/geography-concept-illustration_114360-8498.jpg', alt: 'Географія' },
    { id: 'art', src: 'https://img.freepik.com/free-vector/hand-drawn-art-background_23-2148157511.jpg', alt: 'Мистецтво' },
    { id: 'music', src: 'https://img.freepik.com/free-vector/music-background-with-musical-notes_1639-16220.jpg', alt: 'Музика' },
    { id: 'pe', src: 'https://img.freepik.com/free-vector/hand-drawn-physical-education-background_23-2148154121.jpg', alt: 'Фізкультура' },
    { id: 'biology', src: 'https://img.freepik.com/free-vector/hand-drawn-biology-background_23-2148157463.jpg', alt: 'Біологія' },
    { id: 'chemistry', src: 'https://img.freepik.com/free-vector/hand-drawn-chemistry-background_23-2148157541.jpg', alt: 'Хімія' },
    { id: 'physics', src: 'https://img.freepik.com/free-vector/hand-drawn-physics-background_23-2148157539.jpg', alt: 'Фізика' },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
}));

const SelectedCoverIndicator = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: `4px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    pointerEvents: 'none',
}));

interface FormData extends SubjectData {}

const CreateSubject: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCover, setSelectedCover] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [createdSubject, setCreatedSubject] = useState<any>(null);
    const [openCodeDialog, setOpenCodeDialog] = useState(false);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    const { handleSubmit, control, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            name: '',
            description: '',
            coverImage: '',
            time: ['08:00-09:30', '10:00-11:30', '12:00-13:30'] // Приклад розкладу
        }
    });

    const handleCoverSelect = (coverId: string) => {
        setSelectedCover(coverId);
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (!selectedCover) {
                setSnackbarMessage('Будь ласка, виберіть обкладинку для предмету');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                return;
            }
            
            const subjectData = {
                ...data,
                coverImage: selectedCover,
                time: timeSlots
            };
            
            const response = await createSubject(subjectData);
            setCreatedSubject(response);
            setOpenCodeDialog(true);
            
            setSnackbarMessage('Предмет успішно створено!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            
            reset();
            setSelectedCover('');
            setTimeSlots([]);
        } catch (error) {
            console.error('Error creating subject:', error);
            setSnackbarMessage('Помилка при створенні предмету');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } 
    };
    
    const handleCopyCode = () => {
        if (createdSubject?.code) {
            navigator.clipboard.writeText(createdSubject.code)
                .then(() => {
                    setSnackbarMessage('Код скопійовано в буфер обміну');
                    setSnackbarSeverity('success');
                    setOpenSnackbar(true);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                    setSnackbarMessage('Не вдалося скопіювати код');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                });
        }
    };
    
    const handleCloseDialog = () => {
        setOpenCodeDialog(false);
        navigate(AppRoutes.SUBJECTS);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h1" align="center" gutterBottom>
                    Створення нового предмету
                </Typography>
                
                <StyledPaper elevation={3}>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Назва предмету обов\'язкова' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Назва предмету"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                        
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Опис предмету обов\'язковий' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Опис предмету"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    margin="normal"
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />
                        
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Оберіть обкладинку для предмету
                        </Typography>
                        
                        <Grid container spacing={2}>
                            {availableCoverImages.map((cover) => (
                                <Grid item xs={6} sm={4} key={cover.id}>
                                    <Card>
                                        <CardActionArea onClick={() => handleCoverSelect(cover.id)}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={cover.src}
                                                alt={cover.alt}
                                            />
                                            {selectedCover === cover.id && <SelectedCoverIndicator />}
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate(AppRoutes.SUBJECTS)}
                            >
                                Скасувати
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                            >
                                Створити предмет
                            </Button>
                        </Box>
                    </Box>
                </StyledPaper>
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
            
            <Dialog 
                open={openCodeDialog} 
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Предмет успішно створено!</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Ваш предмет "{createdSubject?.name}" було успішно створено. 
                        Поділіться цим кодом з учнями, щоб вони могли приєднатися до предмету:
                    </Typography>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            my: 3,
                            p: 2,
                            bgcolor: 'primary.light',
                            borderRadius: 1,
                            color: 'white',
                            position: 'relative'
                        }}
                    >
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                            {createdSubject?.code}
                        </Typography>
                        <Tooltip title="Копіювати код">
                            <IconButton 
                                onClick={handleCopyCode} 
                                sx={{ 
                                    ml: 2,
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Учні можуть використати цей код на сторінці "Приєднатися до предмету".
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Зрозуміло
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CreateSubject; 