import React, { useEffect, useState } from 'react';
import { getFirestore, doc, onSnapshot, collection, updateDoc } from 'firebase/firestore';
import { auth } from '../../FirebaseSetup';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
const Notifications = ({ lightMode }) => {
    const [notifications, setNotifications] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [hiddenNotifications, setHiddenNotifications] = useState([]); // Add this line

    useEffect(() => {
        const db = getFirestore();

        if (auth.currentUser) {
            const notificationsCollection = collection(db, 'users', auth.currentUser.uid, 'notifications');
            const resultsCollection = collection(db, 'users', auth.currentUser.uid, 'results');

            const notificationsUnsubscribe = onSnapshot(notificationsCollection, (querySnapshot) => {
                const fetchedNotifications = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'notification' }));
                setNotifications(prevNotifications => ([...prevNotifications, ...fetchedNotifications]));
            });

            const resultsUnsubscribe = onSnapshot(resultsCollection, (querySnapshot) => {
                const fetchedResults = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'result' }));
                setNotifications(prevNotifications => ([...prevNotifications, ...fetchedResults]));
            });

            return () => {
                notificationsUnsubscribe();
                resultsUnsubscribe();
            };
        }
    }, []);


    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Filter the notifications array to only include unread notifications
    const unreadNotifications = notifications.filter(notification => notification.status === 'unread');

    const handleNotificationClick = async (notification) => {
        const db = getFirestore();

        // Define the collection based on the notification type
        const notificationCollection = notification.type === 'notification' ? 'notifications' : 'results';

        const notificationDoc = doc(db, 'users', auth.currentUser.uid, notificationCollection, notification.id);
        try {
            await updateDoc(notificationDoc, {
                status: 'read',
            });

            // Update the local state
            setNotifications(prevNotifications => {
                return prevNotifications.map(n => {
                    if (n.id === notification.id) {
                        return { ...n, status: 'read' };
                    }
                    return n;
                });
            });

        } catch (error) {
            console.error('Error updating notification status:', error);
        }
    };




    return (
        <>
            <IconButton aria-label="notifications" onClick={handleDrawerToggle}>
                <Badge badgeContent={unreadNotifications.length} color="secondary">
                    <NotificationsIcon htmlColor={lightMode ? '#fff' : '#fff'} />
                </Badge>
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
                <Box p={2} width={300}>
                    <Typography variant="h5" gutterBottom>
                        Notifications
                    </Typography>

                    {unreadNotifications.length > 0 ? (
                        <Box sx={{ width: '100%' }}>
                            {unreadNotifications.map((notification) => {
                                const timestamp = notification.timestamp; // Access the timestamp property of each notification
// console.log('notifications', {notification})
                                let formattedDate = '';
                                if (timestamp) {
                                    const date = timestamp.toDate(); // Convert the Timestamp to a JavaScript Date object
                                    formattedDate = format(date, 'dd MMMM yyyy'); // Format the date in "Day month year" format
                                }
                                return (
                                    <Alert
                                        key={notification.id}
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    handleNotificationClick(notification);
                                                }}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                        sx={{ mb: 2 }}
                                        severity="info"
                                        style={hiddenNotifications.includes(notification.id) ? { display: 'none' } : {}}
                                    >
                                        {/*<div>*/}

                                        {/*    <Typography>{notification.gymName}</Typography>*/}
                                        {/*    <Typography>{notification.resultPlace}</Typography>*/}
                                        {/*    <Typography>{notification.message}</Typography>*/}
                                        {/*    <Typography>{notification.eventName}</Typography>*/}
                                        {/*    {timestamp && <Typography>{formattedDate}</Typography>} /!* Render the formatted date if timestamp exists *!/*/}
                                        {/*</div>*/}

                                        {notification.type === "notification" ? (
                                            <>
                                                <Typography variant="paragraph" component="h1" gutterBottom>
                                                    New Event:
                                                </Typography>
                                                <Typography>A new event at {notification.gymName} has been announced!</Typography>
                                                <Typography variant="paragraph" component="h1" gutterBottom>
                                                    {notification.eventTitle}
                                                </Typography>
                                                <Typography variant="paragraph" gutterBottom>
                                                    <Link to={notification.eventId}>Click here to learn more, and save the event.</Link>
                                                </Typography>
                                            </>
                                        ) : null}

                                        {notification.type === "result" ? (
                                            <>
                                                <Typography variant="paragraph" component="h1" gutterBottom>
                                                    New Results:
                                                </Typography>
                                                <Typography>
                                                    Congratulations, you placed {notification.resultPlace} on the {notification.eventDate} in the {notification.eventName} at {notification.gymName}!
                                                </Typography>
                                                {/*<Typography variant="paragraph" gutterBottom>*/}
                                                {/*    Event: {notification.eventName}*/}
                                                {/*</Typography>*/}
                                                {/*<Typography>*/}
                                                {/*    /!*Gym: {notification.gymName}*!/*/}
                                                {/*</Typography>*/}

                                            </>
                                        ) : null}
                                    </Alert>
                                );
                            })}
                        </Box>
                    ) : (
                        <>
                            <Typography variant="body1">No unread notifications</Typography>
                            <Typography variant="body2">See your homepage for upcoming events at your Gyms and Leagues.</Typography>
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default Notifications;
