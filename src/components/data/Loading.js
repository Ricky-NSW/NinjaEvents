import React, { useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import ThemeContext from '../../contexts/ThemeContext';

const Loading = () => {
    const { darkMode } = useContext(ThemeContext);

    return (
        <Backdrop open={true} sx={{ color: darkMode ? '#fff' : '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color={darkMode ? 'inherit' : 'primary'} />
        </Backdrop>
    );
}

export default Loading;
