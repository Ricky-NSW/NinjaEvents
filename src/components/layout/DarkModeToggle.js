// DarkModeToggle.jsx
import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ThemeContext from '../../contexts/ThemeContext';

const DarkModeToggle = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    return (
        <MenuItem>
            <ListItemIcon>
                <IconButton edge="end" color="inherit" onClick={toggleDarkMode}>
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </ListItemIcon>
            <ListItemText primary="Toggle Theme" />
        </MenuItem>
    );
};

export default DarkModeToggle;
