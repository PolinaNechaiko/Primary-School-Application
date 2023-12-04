import {Box} from "@mui/material";
import {Outlet} from "react-router-dom";

const PublicLayout = () => {
    return (
        <Box sx={{
            backgroundColor: 'rgba(0, 176, 255, 0.1)',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Outlet/>
        </Box>
    )
}
export {PublicLayout};