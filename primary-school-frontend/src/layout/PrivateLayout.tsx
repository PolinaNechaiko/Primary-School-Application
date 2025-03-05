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
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {CssBaseline, AppBar} from "@mui/material";

const drawerWidth = 240;
const PrivateLayout = () => {
    const nav = useNavigate();
    const {pathname} = useLocation();
    const { user: currentUser } = useAuth();
    const isStudent = currentUser?.role === 'student';
    const isTeacher = currentUser?.role === 'teacher';
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
            case AppRoutes.MAIN:
                return 'Головна';
            case AppRoutes.JOURNAL:
                return 'Журнал';
            case AppRoutes.INBOX:
                return 'Вхідні';
            case AppRoutes.SUBJECTS:
                return 'Предмети';
            case AppRoutes.STUDENTS:
                return 'Список учнів';
            case AppRoutes.SCHEDULE:
                return 'Розклад занять';
            case AppRoutes.WEEKLY_GAME:
                return 'Гра тижня';
            case AppRoutes.STUDENT_GRADES:
                return 'Мої оцінки';
            case AppRoutes.STUDENT_TASKS:
                return 'Мої завдання';
            default:
                return '';
        }
    };

    // Determine which navigation lists to use based on user role
    const firstNavList = isStudent ? studentNavListFirst : navListFirst;
    const secondNavList = isStudent ? studentNavListSecond : navListSecond;

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center'}}>
                        <img src={logo} alt="logo" style={{width: '40px', height: '40px', marginRight: '10px'}}/>
                        <Typography variant="h6" noWrap component="div">
                            Віртуальна початкова школа
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="body1" sx={{mr: 1}}>
                            {currentUser?.firstName} {currentUser?.lastName}
                        </Typography>
                        <Box
                            onClick={handleClick}
                            sx={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                        >
                            <img src={user} alt="user" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
                }}
            >
                <Toolbar/>
                <Box sx={{overflow: 'auto'}}>
                    <List>
                        {firstNavList.map((item) => (
                            <ListItem key={item.route} disablePadding>
                                <ListItemButton
                                    selected={pathname === item.route}
                                    onClick={() => handleUserClick(item.route)}
                                >
                                    <ListItemIcon>
                                        <img src={item.icon} alt={item.label}
                                             style={{width: '24px', height: '24px'}}/>
                                    </ListItemIcon>
                                    <ListItemText primary={item.label}/>
                                    {isStudent && (
                                        <VolumeUpIcon 
                                            color="primary" 
                                            fontSize="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playAudio(`/audio/nav-${item.label.toLowerCase().replace(/\s+/g, '-')}.mp3`);
                                            }}
                                            sx={{ ml: 1, cursor: 'pointer' }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List>
                        {secondNavList.map((item) => (
                            <ListItem key={item.route} disablePadding>
                                <ListItemButton
                                    selected={pathname === item.route}
                                    onClick={() => handleUserClick(item.route)}
                                >
                                    <ListItemIcon>
                                        <img src={item.icon} alt={item.label}
                                             style={{width: '24px', height: '24px'}}/>
                                    </ListItemIcon>
                                    <ListItemText primary={item.label}/>
                                    {isStudent && (
                                        <VolumeUpIcon 
                                            color="primary" 
                                            fontSize="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playAudio(`/audio/nav-${item.label.toLowerCase().replace(/\s+/g, '-')}.mp3`);
                                            }}
                                            sx={{ ml: 1, cursor: 'pointer' }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemText primary="Вийти"/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar/>
                <audio ref={audioRef} />
                <Outlet/>
            </Box>
            <BasePopup open={open} anchor={anchor} onOpenChange={handleClick}>
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: 1,
                    minWidth: '150px'
                }}>
                    <Stack spacing={1}>
                        <Button variant="text" onClick={handleLogout}>Вийти</Button>
                    </Stack>
                </Box>
            </BasePopup>
        </Box>
    );
};

export { PrivateLayout };
