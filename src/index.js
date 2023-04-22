import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './components/user/AuthProvider';
import GoogleMapsApi from "../src/components/api/GoogleMapsApi";
import DataLayer from "./components/data/DataLayer";

//import theme
import getTheme from './components/theming/theme';
import { ThemeProvider } from '@mui/material/styles';
import ThemeContext from './contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import '../src/components/theming/theme.css';

//MUI date localization

const Root = () => {

    const libraries = ["places"];
// todo: make api a .env file
    const [darkMode, setDarkMode] = useState(false);
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
    // console.log(reportWebVitals())

    return (
        <React.StrictMode>
            <AuthProvider>
                <DataLayer>
                    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
                        <ThemeProvider theme={getTheme(darkMode)}>
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

ReactDOM.render(
    <Root />,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
