// theme.js
import { createTheme } from '@mui/material/styles';

export const createThemeOptions = (mode) => ({
    palette: {
        mode: mode,
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
    typography: {
        h1: {
            fontSize: '3rem',
        },
        h2: {
            fontSize: '2.7rem',
        },
        h3: {
            fontSize: '2.1rem',
            fontWeight: 800,
        },
        h4: {
            fontSize: '2.1rem',
            fontWeight: 400,
        },
        body2: {
            lineHeight: 1.56,
            letterSpacing: '0.1em',
        },
    },
});

export default createThemeOptions;
