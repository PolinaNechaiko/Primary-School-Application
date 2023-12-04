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
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';

import {navListFirst, navListSecond} from "../utils/options/navList.ts";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Stack} from "@mui/system";
import {AppRoutes} from "../utils/AppRoutes.ts";
import React from "react";
import Cookies from "js-cookie";

const drawerWidth = 240;
const PrivateLayout = () => {
    const nav = useNavigate();
    const {pathname} = useLocation();
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
                return 'Предмети'
            case AppRoutes.TASKS:
                return 'Завдання'
        }
    }
    return (
        <Box sx={{display: 'flex', height: '100vh'}}>
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
                    {navListFirst.map(({label, icon, route}, index) => (
                        <ListItem onClick={() => handleUserClick(route)} key={index} disablePadding>
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
                    {navListSecond.map(({label, icon, route}, index) => (
                        <ListItem onClick={() => handleUserClick(route)} key={index} disablePadding>
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
                        <Typography fontWeight={400} variant='h1'
                                    component='span'>{getActivePage(pathname)}</Typography>

                        <Button aria-describedby={id} type="button" onClick={handleClick}>
                            <img src={user } alt='icon'/>
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
                    sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}
                >
                    <Outlet/>
                </Box>
            </Stack>
        </Box>
    )
}
export {PrivateLayout}

const PopupBody = styled('div')(
    ({ theme }) => `
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

