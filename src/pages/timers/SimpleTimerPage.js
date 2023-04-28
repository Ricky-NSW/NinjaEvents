import React, { useContext } from 'react';
import Typography from "@mui/material/Typography";
import TimerList from "../../components/timers/TimerList";
import AuthContext from '../../contexts/AuthContext';

function SimpleTimerPage() {

    const { currentUser } = useContext(AuthContext);

    return (
        <>
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ textAlign: 'center' }}
            >
                Simple Timer
            </Typography>

            <TimerList />

        </>
    );
}

export default SimpleTimerPage;
