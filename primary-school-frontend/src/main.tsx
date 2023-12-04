import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {CssBaseline, ThemeProvider} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {theme} from "./theme/theme.tsx";
import {SnackbarProvider} from "notistack";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                maxSnack={3}
            >
            <App/>
            </SnackbarProvider>
        </ThemeProvider>
    </BrowserRouter>
)
