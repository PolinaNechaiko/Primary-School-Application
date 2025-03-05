import React, { useState, useEffect } from 'react';
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getStudentsList, addStudent, Student, StudentCreateData } from '../../services/api/studentsApi';

const Students = () => {
    const { user, loading: userLoading } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [newStudent, setNewStudent] = useState<StudentCreateData>({ 
        firstName: '', 
        lastName: '', 
        email: '' 
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [error, setError] = useState<string | null>(null);

    // Завантажуємо список студентів незалежно від ролі користувача
    useEffect(() => {
        if (!userLoading) {
            fetchStudents();
        }
    }, [userLoading]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getStudentsList();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Помилка при завантаженні списку учнів');
            setSnackbarMessage('Помилка при завантаженні списку учнів');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async () => {
        try {
            await addStudent(newStudent);
            setOpenDialog(false);
            setNewStudent({ firstName: '', lastName: '', email: '' });
            await fetchStudents();
            setSnackbarMessage('Учня успішно додано');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error adding student:', error);
            setSnackbarMessage('Помилка при додаванні учня');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    if (userLoading || loading) {
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

    const isTeacher = user?.role === 'teacher';

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Список учнів</Typography>
                {isTeacher && (
                    <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                        Додати учня
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ім'я</TableCell>
                            <TableCell>Прізвище</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student._id}>
                                <TableCell>{student.firstName}</TableCell>
                                <TableCell>{student.lastName}</TableCell>
                                <TableCell>{student.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Додати нового учня</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Ім'я"
                            value={newStudent.firstName}
                            onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Прізвище"
                            value={newStudent.lastName}
                            onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={newStudent.email || ''}
                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Скасувати</Button>
                    <Button onClick={handleAddStudent} variant="contained">Додати</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Students; 