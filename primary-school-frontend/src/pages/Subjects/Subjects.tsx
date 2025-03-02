import { Box, Button, Container, Fab, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../utils/AppRoutes';
import { useAuth } from '../../hooks/useAuth';

const Subjects = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';
    
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Мої предмети
            </Typography>
            
            {/* Відображаємо кнопку створення предмету тільки для вчителів */}
            {isTeacher && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(AppRoutes.CREATE_SUBJECT)}
                    >
                        Створити предмет
                    </Button>
                </Box>
            )}
            
            {/* ... existing code for displaying subjects */}
            
            {/* Плаваюча кнопка для мобільної версії */}
            {isTeacher && (
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => navigate(AppRoutes.CREATE_SUBJECT)}
                >
                    <AddIcon />
                </Fab>
            )}
        </Container>
    );
}; 