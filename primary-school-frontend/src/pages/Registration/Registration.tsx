import {Box, Button, Link, Stack, Typography} from "@mui/material";
import logo from '../../assets/logo.jpg'
import {StyledIcon} from "../Login/Login.style.tsx";
import {ControlledTextField} from "../../components/ControlledTextField/ControlledTextField.tsx";
import {useForm} from "react-hook-form";
import {required} from "../../utils/options/validation.ts";
import {useNavigate} from "react-router-dom";
import ControlledSelect from "../../components/ControlledSelectField/ControlledSelectField.tsx";
import {registerUser} from "../../services/api/authorizationApi.ts";
import {enqueueSnackbar} from "notistack";

const Registration = () => {
    const nav = useNavigate();
    const {handleSubmit, control} =
        useForm<any>({
            mode: 'onTouched',
            defaultValues: {username:'',password:'',role:'student',email:''},
        });
    const onSubmit = async (data: any) => {
        try {
            await registerUser(data)
            enqueueSnackbar('Користувач був створений успішно', {
                variant: 'success',
                autoHideDuration: 3000,
            });
            nav('/login')
        } catch (e) {
            console.log(e)
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
            <form onSubmit={handleSubmit(onSubmit)} style={{flex: 1, padding: '2rem 1.5rem 1rem', width: '50%'}}>
                <Typography variant='h1' component='span'>Давайте створимо вам акаунт !</Typography>
                <Typography variant='h3' component='p'>Введіть свої дані для реєстраії </Typography>
                <Stack mt={3} direction='column' gap={1}>
                    <ControlledTextField rules={required} sx={{width: '100%'}} label='Введіть свою пошту' name='email'
                                         control={control}/>
                    <ControlledTextField rules={required} sx={{width: '100%'}} label="Введіть своє ім'я"  name='username'
                                         control={control}/>
                    <ControlledTextField inputProps={{type:'password'}} rules={required} sx={{width: '100%',type:'password'}}  label='Введіть свій пароль' name='password'
                                         control={control}/>
                    <ControlledSelect selectProps={{sx: {width: '100%'}}}
                                      items={[{value: 'student', label: 'Учень'}, {value: "teacher", label: "Викладач"}]}
                                      label='Оберіть вашу роль' name="role" sx={{width: '100%'}} rules={required}
                                      control={control}/>
                </Stack>
                <Link
                    sx={{fontSize: '0.875rem', cursor: 'pointer'}}
                    underline="hover"
                    onClick={() => nav('/login')}
                >
                    Вже маєте акаунт ?
                </Link>
                <Stack mt={2} direction='row'>
                    <Button sx={{width: '100%'}} variant='contained' type='submit'>Зареєструвати</Button>
                </Stack>
            </form>
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
        </Stack>
    );
};

export default Registration;
