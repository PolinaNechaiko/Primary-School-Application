import {Box, Button, styled, Typography} from "@mui/material";
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import logo from '../assets/logo.jpg'
import user from '../assets/user.png'
import {Unstable_Popup as BasePopup} from '@mui/base/Unstable_Popup';
import {navListFirst, navListSecond, studentNavListFirst, studentNavListSecond} from "../utils/options/navList.ts";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Stack} from "@mui/system";
import {AppRoutes} from "../utils/AppRoutes.ts";
import React, { useRef } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../hooks/useAuth";
import CampaignIcon from '@mui/icons-material/Campaign';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const drawerWidth = 240;
const PrivateLayout = () => {
    const nav = useNavigate();
    const {pathname} = useLocation();
    const { user: currentUser } = useAuth();
    const isStudent = currentUser?.role === 'student';
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleUserClick = (route: string) => {
        nav(route)
    }

    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const handleLogout = () => {
        Cookies.remove('sessionToken');
        nav(AppRoutes.LOGIN)
    }
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(anchor ? null : event.currentTarget);
    };

    const playAudio = (audioSrc: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioSrc;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const open = Boolean(anchor);
    const id = open ? 'simple-popup' : undefined;

    const getActivePage = (link: string) => {
        switch (link) {
            case '/':
                return 'Unknown'
            case AppRoutes.JOURNAL:
                return 'Журнал'
            case AppRoutes.STUDENTS:
                return 'Учні'
            case AppRoutes.SCHEDULE:
                return 'Розклад'
            case AppRoutes.SUBJECTS:
                return isStudent ? 'Мої предмети' : 'Предмети'
            case AppRoutes.TASKS:
                return 'Завдання'
            case AppRoutes.WEEKLY_GAME:
                return 'Гра тижня'
            case AppRoutes.STUDENT_GRADES:
                return 'Мої оцінки'
            default:
                if (link.startsWith('/subjects/')) {
                    return 'Деталі предмету';
                }
                return 'Unknown';
        }
    }

    // Choose the appropriate navigation lists based on user role
    const firstNavList = isStudent ? studentNavListFirst : navListFirst;
    const secondNavList = isStudent ? studentNavListSecond : navListSecond;

    return (
        <Box sx={{display: 'flex', height: '100vh'}}>
            <audio ref={audioRef} />
            
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar sx={{display: 'flex', justifyContent: 'center'}}>
                    <img style={{width: '32px', height: '32px'}} src={logo} alt='logo'/>
                </Toolbar>
                <Divider/>
                <List>
                    {firstNavList.map(({label, icon, route}, index) => (
                        <ListItem 
                            onClick={() => handleUserClick(route)} 
                            key={index} 
                            disablePadding
                            secondaryAction={
                                isStudent && (
                                    <VolumeUpIcon 
                                        color="primary" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playAudio(`/audio/menu-${label.toLowerCase().replace(/\s+/g, '-')}.mp3`);
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                )
                            }
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <img style={{width: '21px', height: '21px'}} src={icon} alt='Icon'/>
                                </ListItemIcon>
                                <ListItemText primary={label}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                    {secondNavList.map(({label, icon, route}, index) => (
                        <ListItem 
                            onClick={() => handleUserClick(route)} 
                            key={index} 
                            disablePadding
                            secondaryAction={
                                isStudent && (
                                    <VolumeUpIcon 
                                        color="primary" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playAudio(`/audio/menu-${label.toLowerCase().replace(/\s+/g, '-')}.mp3`);
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                )
                            }
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <img style={{width: '21px', height: '21px'}} src={icon} alt='Icon'/>
                                </ListItemIcon>
                                <ListItemText primary={label}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Stack sx={{width: '100%'}} direction='column' gap={2}>
                <Box component='header' sx={{
                    height: '65px',
                    padding: '0 16px', borderBottom: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)'
                }}>
                    <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontWeight={400} variant='h1' component='span'>
                                {getActivePage(pathname)}
                            </Typography>
                            {isStudent && (
                                <VolumeUpIcon 
                                    color="primary" 
                                    onClick={() => playAudio(`/audio/page-${getActivePage(pathname).toLowerCase().replace(/\s+/g, '-')}.mp3`)}
                                    sx={{ cursor: 'pointer' }}
                                />
                            )}
                        </Box>

                        <Button 
                            aria-describedby={id} 
                            type="button" 
                            onClick={handleClick}
                            sx={{ position: 'relative' }}
                        >
                            <img src={user} alt='icon'/>
                            {isStudent && (
                                <VolumeUpIcon 
                                    color="primary" 
                                    sx={{ 
                                        position: 'absolute', 
                                        top: -10, 
                                        right: -10, 
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        padding: '2px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playAudio('/audio/logout.mp3');
                                    }}
                                />
                            )}
                        </Button>
                        <BasePopup id={id} open={open} anchor={anchor}>
                            <PopupBody>
                                <span>Account settings </span>
                                <span onClick={handleLogout}>Logout </span>
                            </PopupBody>
                        </BasePopup>
                    </Toolbar>
                </Box>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        p: 3,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <Outlet/>
                </Box>
            </Stack>
        </Box>
    )
}
export {PrivateLayout}

const PopupBody = styled('div')(
    ({theme}) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid fff;
  background-color: fff;
  box-shadow: ${
        theme.palette.mode === 'dark'
            ? `0px 4px 8px rgb(0 0 0 / 0.7)`
            : `0px 4px 8px rgb(0 0 0 / 0.1)`
    };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
  display:flex;
  flex-direction: column;
  gap:8px;
  cursor:pointer;
`,
);

