//rename this file to GymListPage.js

import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

//Firebase
import { db } from '../../FirebaseSetup';

//MUI
import Button from "@mui/material/Button";
import GymsList from "../../components/gyms/GymsList";
import GoogleMapArray from '../../components/api/GoogleMapArray';
//MUI Dialogue
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
function GymsPage() {

    return (
        <div>
            <h1>Gyms</h1>
            <GymsList />

            <h2>MAP</h2>
            <GoogleMapArray markers={gyms} />
        </div>
    );
}

export default GymsPage;
