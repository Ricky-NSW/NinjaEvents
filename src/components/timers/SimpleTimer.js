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
import { useDataLayer } from '../data/DataLayer';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, addDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../FirebaseSetup';

const SimpleTimer = () => {
    const [timerName, setTimerName] = useState('');
    const [ninjaName, setNinjaName] = useState('');
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const countRef = useRef(null);
    const { currentUser } = useDataLayer();
    const { id } = useParams(); // Get the timer ID from the URL
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (currentUser && id) {
            const timerDocRef = doc(db, `users/${currentUser.id}/timers/${id}`);
            const unsubscribe = onSnapshot(timerDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const timerData = docSnapshot.data();
                    setTimerName(timerData.name);
                } else {
                    console.error('Timer not found in Firestore');
                }
            });

            // Fetch records and listen for updates
            const recordsQuery = query(collection(db, `users/${currentUser.id}/timers/${id}/records`), orderBy('recordedTime', 'asc'));
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
    }, [currentUser, id]);

    const handleTimerNameChange = (e) => setTimerName(e.target.value);
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
        if (currentUser && id) {
            try {
                const recordsCollection = collection(db, `users/${currentUser.id}/timers/${id}/records`);
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
        if (currentUser && id) {
            try {
                const timerDocRef = doc(db, `users/${currentUser.id}/timers/${id}`);
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

    return (
        // this is the timer display
        <Grid container spacing={2}>
            {/*<Grid item xs={12}>*/}
            {/*    <TextField*/}
            {/*        label="Timer Name"*/}
            {/*        value={timerName}*/}
            {/*        onChange={handleTimerNameChange}*/}
            {/*    />*/}
            {/*</Grid>*/}
            <br />
            <br />
            <br />
            <Typography variant="h4">{timerName}</Typography>
            <Grid item xs={12}>
                <TextField
                    label="Ninja Name"
                    value={ninjaName}
                    onChange={handleNinjaNameChange}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h1">{formatTime(timer)}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                    <Button onClick={restartTimer}>Restart</Button>
                    {isActive ? (
                        <Button onClick={stopTimer}>Stop</Button>
                    ) : (
                        <Button onClick={startTimer}>Start</Button>
                    )}
                    <Button onClick={saveAndClear}>Save</Button>
                </Box>
            </Grid>
            {/*//list of recorded times*/}
            <Grid item xs={12}>
                <Typography variant="h6">Records:</Typography>
                <List>
                    {records.map((record) => (
                        <ListItem key={record.id}>
                            <ListItemText primary={`${record.ninjaName}: ${formatTime(record.recordedTime)}`} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
};

export default SimpleTimer;
