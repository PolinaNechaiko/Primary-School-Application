import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Snackbar,
    Alert,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Divider,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { 
    createWeeklyGame, 
    getCurrentWeeklyGame, 
    getAllWeeklyGames,
    WeeklyGame as WeeklyGameType,
    WeeklyGameData
} from '../../services/api/weeklyGameApi';

const WeeklyGame: React.FC = () => {
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [gameUrl, setGameUrl] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [currentWeeklyGame, setCurrentWeeklyGame] = useState<WeeklyGameType | null>(null);
    const [loading, setLoading] = useState(true);

    // Example game templates
    const gameTemplates = [
        {
            id: 1,
            title: 'Знайди слова на букву',
            description: 'Гра для вивчення літер. Учні мають знайти всі слова, які починаються на певну букву.',
            image: 'https://learningapps.org/display?v=p5dkcmhvj21'
        },
        {
            id: 2,
            title: 'Математичні пазли',
            description: 'Гра для вивчення математики. Учні мають розв\'язати приклади та скласти пазл.',
            image: 'https://learningapps.org/display?v=p2uo8n9jc21'
        },
        {
            id: 3,
            title: 'Вікторина',
            description: 'Гра-вікторина з різних предметів. Учні відповідають на запитання та отримують бали.',
            image: 'https://learningapps.org/display?v=p6bkj7oo521'
        }
    ];

    useEffect(() => {
        const fetchCurrentGame = async () => {
            try {
                setLoading(true);
                const game = await getCurrentWeeklyGame();
                setCurrentWeeklyGame(game);
            } catch (error: any) {
                console.error('Error fetching current game:', error);
                // Якщо гра не знайдена (404), це нормально, просто немає активної гри
                if (error.response && error.response.status !== 404) {
                    setSnackbarMessage('Помилка при завантаженні гри тижня');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentGame();
    }, []);

    const handleCreateWeeklyGame = async () => {
        if (!title || !description || !gameUrl) {
            setSnackbarMessage('Будь ласка, заповніть всі поля');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            setLoading(true);
            const gameData: WeeklyGameData = {
                title,
                description,
                gameUrl
            };

            const newGame = await createWeeklyGame(gameData);
            setCurrentWeeklyGame(newGame);
            setTitle('');
            setDescription('');
            setGameUrl('');
            setSnackbarMessage('Тематичну гру тижня успішно створено');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error: any) {
            console.error('Error creating weekly game:', error);
            setSnackbarMessage('Помилка при створенні гри');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTemplate = (template: any) => {
        setTitle(template.title);
        setDescription(template.description);
        setGameUrl(template.image);
    };

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!isTeacher) {
        return (
            <Container>
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Доступ до створення тематичних ігор мають тільки вчителі
                </Typography>
                
                {currentWeeklyGame && (
                    <Paper sx={{ p: 3, mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Гра тижня: {currentWeeklyGame.title}
                        </Typography>
                        
                        <Typography variant="body1" paragraph>
                            {currentWeeklyGame.description}
                        </Typography>
                        
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <iframe
                                src={currentWeeklyGame.gameUrl}
                                style={{ width: '100%', height: '500px', border: 'none' }}
                                title={currentWeeklyGame.title}
                                allowFullScreen
                            />
                        </Box>
                    </Paper>
                )}
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Тематична гра тижня
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Створення нової тематичної гри
                </Typography>

                <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                        label="Заголовок гри"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        label="Опис гри"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Опишіть тему тижня та завдання для учнів"
                    />

                    <TextField
                        label="URL гри з LearningApps.org"
                        fullWidth
                        margin="normal"
                        value={gameUrl}
                        onChange={(e) => setGameUrl(e.target.value)}
                        placeholder="https://learningapps.org/display?v=..."
                        helperText="Вставте посилання на гру з сайту LearningApps.org"
                    />

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateWeeklyGame}
                            startIcon={<SportsEsportsIcon />}
                        >
                            Створити гру тижня
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {currentWeeklyGame && (
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Поточна гра тижня
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            {currentWeeklyGame.title}
                        </Typography>

                        <Typography variant="body1" paragraph>
                            {currentWeeklyGame.description}
                        </Typography>

                        <Box sx={{ mt: 2, mb: 2 }}>
                            <iframe
                                src={currentWeeklyGame.gameUrl}
                                style={{ width: '100%', height: '500px', border: 'none' }}
                                title={currentWeeklyGame.title}
                                allowFullScreen
                            />
                        </Box>
                    </Box>
                </Paper>
            )}

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Шаблони ігор
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                    Оберіть один із шаблонів або створіть власну гру на сайті <a href="https://learningapps.org/createApp.php" target="_blank" rel="noopener noreferrer">LearningApps.org</a>
                </Typography>

                <Grid container spacing={3}>
                    {gameTemplates.map((template) => (
                        <Grid item xs={12} sm={6} md={4} key={template.id}>
                            <Card>
                                <CardActionArea onClick={() => handleSelectTemplate(template)}>
                                    <CardMedia
                                        component="iframe"
                                        height="200"
                                        src={template.image}
                                        title={template.title}
                                        sx={{ border: 'none' }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {template.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {template.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

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

export default WeeklyGame; 