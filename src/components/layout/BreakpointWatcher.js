import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const BreakpointWatcher = () => {
    const theme = useTheme();

    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));
    const isXl = useMediaQuery(theme.breakpoints.only('xl'));

    React.useEffect(() => {
        if (isXs) {
            console.log('xs');
        } else if (isSm) {
            console.log('sm');
        } else if (isMd) {
            console.log('md');
        } else if (isLg) {
            console.log('lg');
        } else if (isXl) {
            console.log('xl');
        }
    }, [isXs, isSm, isMd, isLg, isXl]);

    return null;
};

export default BreakpointWatcher;
