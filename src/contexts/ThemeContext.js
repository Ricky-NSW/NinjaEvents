// src/contexts/ThemeContext.js
import { createContext } from 'react';

const ThemeContext = createContext({
    darkMode: false,
    toggleDarkMode: () => {},
});

export default ThemeContext;
