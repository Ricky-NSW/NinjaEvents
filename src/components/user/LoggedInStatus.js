import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import React, {useState, useEffect, useContext} from 'react';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';
import AuthContext from "../../contexts/AuthContext";

function LoggedInStatus() {
    const label = { inputProps: { 'aria-label': 'Size switch demo' } };
    const { currentUser } = useContext(AuthContext);


    return (
        <div>
            {currentUser ? (
                <div>
                    <Avatar alt="Travis Howard" src="https://mui.com/static/images/avatar/1.jpg" />
                </div>
            ) : (
                <div>
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>X</Avatar>
                    <p>You are not signed in.</p>
                </div>
            )}
            <Switch {...label} checked={currentUser} color={ currentUser ? 'default' : 'warning' } />
        </div>
    );
}

export default LoggedInStatus;
