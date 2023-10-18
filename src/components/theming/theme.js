// theme.js
import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

// This is passed into the index.js file and wraps everything
export const createThemeOptions = (mode) => ({
    palette: {
        mode: mode,
        primary: {
            white: '#FFFFFF',
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
            white: colors.grey.white,
            light: colors.grey.light,
            medium: colors.grey.medium,
            dark: colors.grey.dark,
            almostBlack: colors.grey.almostBlack
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
            color: mode === 'dark' ? colors.grey.almostBlack : colors.primary.light,
            '& a': {
                color: mode === 'dark' ? colors.secondary.light : colors.grey.almostBlack,
            }
        },
        h3: {
            fontSize: '2.1rem',
            fontWeight: 800,
            color: mode === 'dark' ? colors.primary.dark : colors.primary.dark,
            //a sibling
            '&': {
                textDecoration: 'none',
            }
        },
        h4: {
            fontSize: '2.1rem',
            fontWeight: 400,
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 400,
        },
        body1: {
            lineHeight: 1.56,
            letterSpacing: '1px',
            '& a': {
                // color: mode === 'dark' ? colors.secondary.light : colors.primary.light,
            }
        },
        body2: {
            fontSize: '1rem',
            lineHeight: 1.2,
            letterSpacing: '1px',
        },
        // bodyBold: {
        //     fontSize: '1rem',
        //     lineHeight: 1.2,
        //     letterSpacing: '1px',
        //     fontWeight: 'bold',
        // },
        body3: {
            fontSize: '0.8rem',
            letterSpacing: '1px',
        },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    // color: mode === 'dark' ? colors.secondary.light : colors.primary.light,
                    textDecoration: 'none',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                'body': {
                    backgroundColor: mode === 'dark' ? colors.grey.almostBlack : colors.grey.light,  // Or whatever you want to change
                },
                'a': {
                    textDecoration: 'none',
                },
            },
        },
    },
});

export default createThemeOptions;
