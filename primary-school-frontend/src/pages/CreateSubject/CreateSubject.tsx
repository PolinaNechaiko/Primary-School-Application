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
    styled
} from '@mui/material';
import { AppRoutes } from '../../utils/AppRoutes';
import { createSubject, SubjectData } from '../../services/api/subjectsApi';

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
    const [selectedCover, setSelectedCover] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const { handleSubmit, control, formState: { errors } } = useForm<FormData>({
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
        if (!selectedCover) {
            setSnackbarMessage('Будь ласка, оберіть обкладинку для предмету');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const subjectData: SubjectData = {
                ...data,
                coverImage: selectedCover
            };
            
            await createSubject(subjectData);
            
            setSnackbarMessage('Предмет успішно створено!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            
            // Перенаправляємо на основну сторінку після успішного створення
            setTimeout(() => {
                navigate(AppRoutes.MAIN);
            }, 1500);
        } catch (error: any) {
            setSnackbarMessage(error.response?.data?.message || 'Помилка при створенні предмету');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
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
                                            <CardContent>
                                                <Typography variant="body2" align="center">
                                                    {cover.alt}
                                                </Typography>
                                            </CardContent>
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
        </Container>
    );
};

export default CreateSubject; 