import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/material';
import img from '../../assets/comingSoon.svg';
const ComingSoonComponent = ({
                                 onClick,
                             }: {
    onClick: () => void;
}) => {
    return (
        <Stack
            height="100%"
            width="100%"
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: 'min(100% - 2rem, 700px)',
                    marginInline: 'auto',
                    borderRadius: '20px',
                    padding: {
                        xs: '40px 20px',
                        sm: '60px 60px',
                        md: '80px 100px',
                    },
                    flexDirection: 'column',
                    textAlign: 'center',
                    gap: 3,
                }}
            >
                <img src={img} alt='Soon' />
                <Stack>
                    <Typography variant="h1">Незабаром!</Typography>
                    <Typography variant="h4" color="#496683">
                        Ми раді повідомити, що незабаром ця функція стане доступною для всіх наших користувачів..
                    </Typography>
                </Stack>
                <Button
                    onClick={onClick}
                    variant="contained"
                    sx={{
                        width: {
                            xs: '100%',
                            sm: 'auto',
                        },
                    }}
                >
                    <Typography variant="h3">Вернутись</Typography>
                </Button>
            </Box>
        </Stack>
    );
};

export default ComingSoonComponent;
