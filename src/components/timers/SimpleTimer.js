// SimpleTimer.js
import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';

import { useDataLayer } from '../data/DataLayer';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, addDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../FirebaseSetup';
import QRCode from 'qrcode.react';

const SimpleTimer = () => {
    const [timerName, setTimerName] = useState('');
    const [ninjaName, setNinjaName] = useState('');
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const countRef = useRef(null);
    const { currentUser } = useDataLayer();
    const [records, setRecords] = useState([]);
    const { userId, timerId } = useParams(); // Get the userId and timerId from the URL
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        if (timerId) {
            const timerDocRef = doc(db, `users/${userId}/timers/${timerId}`);
            const unsubscribe = onSnapshot(timerDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const timerData = docSnapshot.data();
                    console.log("Fetched timer data:", timerData); // Add this line
                    setTimerName(timerData.name);
                } else {
                    console.error('Timer not found');
                }
            });

            // Fetch records and listen for updates
            const recordsQuery = query(
                collection(db, `users/${userId}/timers/${timerId}/records`),
                orderBy('recordedTime', 'asc')
            );
            const unsubscribeRecords = onSnapshot(recordsQuery, (querySnapshot) => {
                const recordsData = [];
                querySnapshot.forEach((doc) => {
                    recordsData.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setRecords(recordsData);
            });

            return () => {
                unsubscribe();
                unsubscribeRecords();
            };
        }
    }, [timerId]);

    const handleNinjaNameChange = (e) => setNinjaName(e.target.value);

    const formatTime = (time) => {
        const milliseconds = ('00' + (time % 1000)).slice(-3);
        const seconds = ('0' + (Math.floor(time / 1000) % 60)).slice(-2);
        const minutes = ('0' + (Math.floor(time / 60000) % 60)).slice(-2);
        return `${minutes}:${seconds}:${milliseconds}`;
    };

    const startTimer = () => {
        setIsActive(true);
        countRef.current = setInterval(() => {
            setTimer((timer) => timer + 10);
        }, 10);
    };

    const stopTimer = () => {
        setIsActive(false);
        clearInterval(countRef.current);
    };

    const restartTimer = () => {
        setIsActive(false);
        clearInterval(countRef.current);
        setTimer(0);
    };

    const saveNewRecord = async () => {
        if (currentUser && timerId) {
            try {
                const recordsCollection = collection(db, `users/${currentUser.id}/timers/${timerId}/records`);
                const newRecord = {
                    ninjaName: ninjaName,
                    recordedTime: timer,
                };
                const docRef = await addDoc(recordsCollection, newRecord);
                console.log('Record added with ID:', docRef.id);
            } catch (e) {
                console.error('Error adding new record:', e);
            }
        }
    };

    const saveAndClear = async () => {
        if (currentUser && timerId) {
            try {
                const timerDocRef = doc(db, `users/${currentUser.id}/timers/${timerId}`);
                await updateDoc(timerDocRef, {
                    name: timerName,
                    ninjaName: ninjaName,
                    timer: timer,
                });
            } catch (e) {
                console.error('Error updating timer:', e);
            }
        }
        await saveNewRecord();
        setNinjaName('');
        restartTimer();
    };

    const getOrdinalSuffix = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href).then(
            () => {
                console.log("Copied URL to clipboard:", window.location.href);
                setSnackbarOpen(true); // Open the Snackbar
            },
            (err) => {
                console.error("Could not copy URL to clipboard:", err);
            }
        );
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    return (
        // this is the timer display
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <Typography variant="h1">{timerName}</Typography>
            </Grid>
            <Grid item xs={3}>
                {!currentUser && (<QRCode value={window.location.href} size={75} />)}
            </Grid>
            {currentUser ? (
                <span>
            <Grid item xs={12}>
                <TextField
                    label="Ninja Name"
                    value={ninjaName}
                    onChange={handleNinjaNameChange}
                    sx={{ width: '100%' }}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h1">{formatTime(timer)}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                    <Button variant="outlined" onClick={restartTimer}>Restart</Button>
                    {isActive ? (
                        <Button variant="contained" onClick={stopTimer}>Stop</Button>
                    ) : (
                        <Button variant="contained" onClick={startTimer}>Start</Button>
                    )}
                    <Button variant="outlined" onClick={saveAndClear}>Save</Button>
                </Box>
            </Grid>
        </span>) : (
                <Grid item xs={12}>
                    <Typography variant="p">Results are updated live.</Typography>
                </Grid>
            )}

            {/*//list of recorded times*/}
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    bgColor: 'background.paper',
                    padding: '10px',
                    margin: '32px',
                    }}
            >
                {/*//list of recorded times*/}
                <Grid container spacing={2} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="h6">Results:</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        {currentUser && (
                            <>
                                <Button variant="outlined" onClick={copyToClipboard}>Share</Button>
                                <Snackbar
                                    open={snackbarOpen}
                                    autoHideDuration={4000}
                                    onClose={handleSnackbarClose}
                                    message="URL copied to your clipboard"
                                />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <List>
                            {records.map((record, index) => (
                                <ListItem key={record.id}>
                                    <ListItemText
                                        primary={`${getOrdinalSuffix(
                                            index + 1
                                        )} ${record.ninjaName}: ${formatTime(record.recordedTime)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default SimpleTimer;
