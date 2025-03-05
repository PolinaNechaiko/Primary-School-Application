import {Box, Button, Link, Stack, Typography} from "@mui/material";
import logo from '../../assets/logo.jpg'
import {StyledIcon} from "./Login.style.tsx";
import {ControlledTextField} from "../../components/ControlledTextField/ControlledTextField.tsx";
import {useForm} from "react-hook-form";
import {required} from "../../utils/options/validation.ts";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../../services/api/authorizationApi.ts";
import {AppRoutes} from "../../utils/AppRoutes.ts";
import {enqueueSnackbar} from "notistack";
import Cookies from 'js-cookie';
import { useState } from "react";
import { CircularProgress } from "@mui/material";

const Login = () => {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const {handleSubmit, control} =
        useForm<any>({
            mode: 'onTouched',
            defaultValues: {},
        });

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const response = await loginUser(data);
            console.log(response);
            // Зберігаємо токен
            Cookies.set('sessionToken', response.authentication.sessionToken, { 
                expires: 7, 
                secure: true, 
                sameSite: 'Strict' 
            });
            
            // Отримуємо інформацію про користувача
            const userData = response.user;
            
            // Перенаправляємо користувача в залежності від його ролі та стану
            if (userData.role === 'teacher') {
                // Якщо вчитель не має предметів, перенаправляємо на створення предмету
                if (!userData.subjects || userData.subjects.length === 0) {
                    nav(AppRoutes.CREATE_SUBJECT);
                } else {
                    // Інакше на сторінку предметів
                    nav(AppRoutes.SUBJECTS);
                }
            } else {
                // Якщо учень не приєднався до предмету, перенаправляємо на сторінку приєднання
                if (!userData.isJoinedToSubject) {
                    nav(AppRoutes.JOIN_SUBJECT);
                } else {
                    // Інакше на сторінку предметів
                    nav(AppRoutes.SUBJECTS);
                }
            }
        } catch (e) {
            enqueueSnackbar('Невірні дані !', {
                variant: 'error',
                autoHideDuration: 3000,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack direction='row' sx={{
            width: '700px',
            boxShadow: 'rgba(9, 63, 127, 0.1) 7px 4px 120px 0px, rgba(0, 0, 0, 0.05) 5px 11px 94',
            backgroundColor: 'rgb(255, 255, 255);',
            borderRadius: '12px',
            height: '600px'
        }}>
            <Box sx={{
                display: 'flex',
                height: '100%',
                width: '50%',
                justifyContent: 'center',
                paddingTop: '150px',
                backgroundColor: 'rgb(233, 242, 252)'
            }}>
                <StyledIcon src={logo} alt='logo'/>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)} style={{flex: 1, padding: '7.5rem 1.5rem 1.25rem', width: '50%'}}>
                <Typography variant='h1' component='span'>З поверненням !</Typography>
                <Typography variant='h3' component='p'>Будь ласка, введіть свої дані для входу</Typography>
                <Stack mt={3} direction='column' gap={1}>
                    <ControlledTextField rules={required} sx={{width: '100%'}} label='Введіть свою пошту' name='email'
                                         control={control}/>
                    <ControlledTextField inputProps={{type: 'password'}} rules={required}
                                         sx={{width: '100%', type: 'password'}} label='Введіть свій пароль'
                                         name='password'
                                         control={control}/>
                </Stack>
                <Link
                    sx={{fontSize: '0.875rem', cursor: 'pointer'}}
                    underline="hover"
                    onClick={() => nav('/register')}
                >
                    Створити акаунт
                </Link>
                <Stack mt={2} direction='row'>
                    <Button 
                        sx={{width: '100%'}} 
                        variant='contained' 
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Увійти'}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
};

export default Login;
