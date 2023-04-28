// TimerList.js
import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { useDataLayer } from '../data/DataLayer';
import { db } from '../../FirebaseSetup';
import { useNavigate } from 'react-router-dom';

const TimerList = () => {
    const [timerName, setTimerName] = useState('');
    const [timers, setTimers] = useState([]);
    const { currentUser } = useDataLayer();
    const navigate = useNavigate();

    console.log('current user on timers list', currentUser)

    useEffect(() => {
        if (currentUser) {
            const q = query(
                collection(db, `users/${currentUser.id}/timers`),
                orderBy('createdAt', 'desc')
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setTimers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            });
            return () => {
                unsubscribe();
            };
        }
    }, [currentUser]);

    const createTimer = async () => {
        try {
            await addDoc(collection(db, `users/${currentUser.id}/timers`), {
                name: timerName,
                createdAt: new Date(),
            });
            setTimerName('');
        } catch (e) {
            console.error('Error adding timer:', e);
        }
    };

    const handleTimerClick = (timerId) => {
        navigate(`/timers/${timerId}`);
    };

    return (
        <div>
            <TextField
                label="Timer Name"
                value={timerName}
                onChange={(e) => setTimerName(e.target.value)}
            />
            <Button onClick={createTimer} disabled={!timerName}>
                Create
            </Button>
            <List>
                {timers.map((timer) => (
                    <ListItem
                        button
                        key={timer.id}
                        onClick={() => handleTimerClick(timer.id)}
                    >
                        <ListItemText primary={timer.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default TimerList;
