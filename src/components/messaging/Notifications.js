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

const Notifications = ({ lightMode }) => {
    const [notifications, setNotifications] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const db = getFirestore();

        if (auth.currentUser) { // Add condition to check if auth.currentUser is not null
            const notificationsCollection = collection(db, 'users', auth.currentUser.uid, 'notifications');

            const unsubscribe = onSnapshot(notificationsCollection, (querySnapshot) => {
                const fetchedNotifications = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setNotifications(fetchedNotifications || []);
            });

            return () => unsubscribe();
        }
    }, []);


    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Filter the notifications array to only include unread notifications
    const unreadNotifications = notifications.filter(notification => notification.status === 'unread');

    const handleNotificationClick = async (notification) => {
        const db = getFirestore();
        const notificationDoc = doc(db, 'users', auth.currentUser.uid, 'notifications', notification.id);
console.log('bla bla')
        await updateDoc(notificationDoc, {
            status: 'read',
        });
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
                            {unreadNotifications.map((notification) => (
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
                                    severity='info'
                                >
                                    <div>
                                        <Typography variant="paragraph" component="h1" gutterBottom>
                                            {notification.eventTitle}
                                        </Typography>
                                        <Typography>
                                            {notification.gymName}
                                        </Typography>
                                    </div>
                                </Alert>
                            ))}
                        </Box>
                    ) : (
                        <>
                            <Typography variant="body1">No unread notifications</Typography>
                            <Typography variant="body2">See the events page for any upcoming events</Typography>
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );

};

export default Notifications;
