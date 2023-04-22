// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = (darkMode) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#9ccc65' : '#d8f082',
            },
            secondary: {
                main: darkMode ? '#90caf9' : '#647cd6',
            },
            info: {
                main: darkMode ? '#80cbc4' : '#5e9bc5',
            },
            background: {
                paper: darkMode ? '#424242' : '#f7f6f1',
            },
        },
        typography: {
            fontFamily: 'Mukta',
            fontSize: 14,
            h1: {
                fontWeight: 700,
            },
        },
        spacing: 8,
        shape: {
            borderRadius: 4,
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    colorInherit: {
                        backgroundColor: darkMode ? '#424242' : '#313030',
                        color: '#fff',
                    },
                },
                defaultProps: {
                    color: 'inherit',
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    root: {
                        width: 42,
                        height: 26,
                        padding: 0,
                        margin: 8,
                    },
                    thumb: {
                        width: 24,
                        height: 24,
                    },
                    track: {
                        borderRadius: 13,
                        border: '1px solid #bdbdbd',
                        backgroundColor: '#fafafa',
                        opacity: 1,
                        transition:
                            'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    },
                },
            },
        },
    });

export default theme;
