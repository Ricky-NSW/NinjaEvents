// theme.js
import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

// This is passed into the index.js file and wraps everything
export const createThemeOptions = (mode, colors) => ({
    palette: {
        mode: mode,
        primary: {
            light: colors.primary.light,
            main: colors.primary.main,
            dark: colors.primary.dark,
            contrastText: colors.primary.contrastText,
        },
        secondary: {
            light: colors.secondary.light,
            main: colors.secondary.main,
            dark: colors.secondary.dark,
            contrastText: colors.secondary.contrastText,
        },
        grey: { // <-- add this
            light: colors.grey.light,
            medium: colors.grey.medium,
            dark: colors.grey.dark
        },
    },
    typography: {
        h1: {
            fontSize: '2.55rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
        },
        h2: {
            fontSize: '2.45rem',
        },
        h3: {
            fontSize: '2.1rem',
            fontWeight: 800,
            color: mode === 'dark' ? colors.primary.dark : colors.primary.dark,
        },
        h4: {
            fontSize: '2.1rem',
            fontWeight: 400,
        },
        body1: {
            lineHeight: 1.56,
            letterSpacing: '0.1em',
            '& a': {
                color: mode === 'dark' ? colors.secondary.light : colors.primary.light,
            }
        },
        body2: {
            lineHeight: 1.56,
            letterSpacing: '0.1em',
        },
    },
});

export default createThemeOptions;
