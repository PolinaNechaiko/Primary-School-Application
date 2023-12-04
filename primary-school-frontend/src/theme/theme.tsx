import PoppinsTtf from '../assets/fonts/Poppins.ttf'
import { createTheme, ThemeOptions } from '@mui/material';

export const theme: ThemeOptions = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#227EE0',
        },
        background: {
            default: '#FFF',
        },
    },
    typography: {
        fontFamily: 'Open Sans',
        h1: {
            fontSize: 24,
            fontWeight: 500,
            lineHeight: '36px',
        },
        h2: {
            fontSize: 18,
        },
        h3: {
            fontSize: 16,
            lineHeight: '24px',
        },
        h4: {
            fontSize: 14,
            lineHeight: '20px',
        },
        subtitle1: {
            fontSize: 12,
            color: 'black',
            lineHeight: '16px',
        },
        subtitle2: {
            fontSize: 12,
            color: '#496683',
            lineHeight: '16px',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 550,
            md: 769,
            lg: 1024,
            xl: 1440,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: url(${PoppinsTtf});
        }
      `,
        }
    }
});
