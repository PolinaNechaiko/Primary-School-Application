import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../services';
import { AppRoutes } from '../../utils/AppRoutes';
import { useForm } from 'react-hook-form';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Alert,
    Stack,
    styled
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import { ControlledTextField } from '../ControlledTextField/ControlledTextField';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const SpeakerMessage = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    marginBottom: theme.spacing(4),
}));

const JoinSubject: React.FC = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const { handleSubmit, control } = useForm<{ subjectCode: string }>({
        mode: 'onTouched',
        defaultValues: { subjectCode: '' },
    });

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, []);

    const onSubmit = async (data: { subjectCode: string }) => {
        try {
            await API.post('/join-subject', { subjectCode: data.subjectCode });
            navigate(AppRoutes.SUBJECTS);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Невірний код предмету');
        }
    };

    return (
        <Container maxWidth="sm">
            <audio ref={audioRef} src="/audio/join-subject-message.mp3" />
            
            <Box sx={{ mt: 8, mb: 4 }}>
                <StyledPaper elevation={3}>
                    <SpeakerMessage>
                        <CampaignIcon color="primary" />
                        <Typography variant="body1" color="primary.dark">
                            Нехай батьки тебе приєднають до предмету
                        </Typography>
                    </SpeakerMessage>

                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Приєднатися до предмету
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                        <ControlledTextField
                            name="subjectCode"
                            control={control}
                            rules={{ required: 'Код предмету обов\'язковий' }}
                            label="Код предмету"
                            placeholder="Введіть код предмету"
                            sx={{ mb: 2, width: '100%' }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Приєднатися
                        </Button>
                    </Box>
                </StyledPaper>
            </Box>
        </Container>
    );
};

export default JoinSubject; 