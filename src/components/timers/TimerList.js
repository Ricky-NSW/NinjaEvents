// TimerList.js
//TODO: get the name of the users Gym from their id, and display it in the list
import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { useDataLayer } from '../data/DataLayer';
import { db } from '../../FirebaseSetup';
import { useNavigate } from 'react-router-dom'; // this replaces useHistory

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
        navigate(`/users/${currentUser.id}/timers/${timerId}`);
    };

    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <div>
            <TextField
                label="Timer Name"
                value={timerName}
                onChange={(e) => setTimerName(e.target.value)}
                size={'small'}
                // margin-right
                sx={{ mr: 2 }}
            />
            <Button
                onClick={createTimer}
                disabled={!timerName}
                // style the button
                variant="contained"
                color="primary"


            >
                Create a new timer
            </Button>
            <List>
                {timers.map((timer) => (
                    <ListItem
                        button
                        key={timer.id}
                        onClick={() => handleTimerClick(timer.id)}
                        sx={{ borderColor: 'grey.500', borderWidth: '1px' }}
                    >
                        <ListItemText
                            primary={timer.name}
                            secondary={formatDate(timer.createdAt)}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default TimerList;
