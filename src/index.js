//index.js
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './components/user/AuthProvider';
import GoogleMapsApi from "../src/components/api/GoogleMapsApi";
import { DataLayer } from "./components/data/DataLayer";
import reducer, { initialState } from './components/data/reducer';
import * as serviceWorker from './serviceWorker';

//import theme
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Add createTheme import here
import ThemeContext from './contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './components/theming/theme';
import createThemeOptions from './components/theming/theme';

//MUI date localization

const Root = () => {

    const libraries = ["places"];
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);
    const theme = createTheme(createThemeOptions(darkMode ? 'dark' : 'light'));


    return (
        <React.StrictMode>
            <AuthProvider>
                <DataLayer initialState={initialState} Reducer={reducer}>
                    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <GoogleMapsApi
                                libraries={libraries}
                                apiKey={apiKey}
                            >
                                <App />
                            </GoogleMapsApi>
                        </ThemeProvider>
                    </ThemeContext.Provider>
                </DataLayer>
            </AuthProvider>
        </React.StrictMode>
    );
};

// ReactDOM.render(
//     <Root />,
//     document.getElementById('root')
// );

// createRoot(document.getElementById('root')).render(<App />);
createRoot(document.getElementById('root')).render(<Root />);
serviceWorker.register();



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
