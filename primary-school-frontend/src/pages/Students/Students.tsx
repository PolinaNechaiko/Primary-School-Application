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
import { getStudentsList, addStudent } from '../../services/api/studentsApi';

const Students = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '' });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await getStudentsList();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
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
            setNewStudent({ name: '', email: '' });
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Список учнів</Typography>
                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                    Додати учня
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ім'я</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Предмети</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student: any) => (
                            <TableRow key={student._id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>
                                    {student.subjects?.map((subject: any) => subject.name).join(', ') || '-'}
                                </TableCell>
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
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={newStudent.email}
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