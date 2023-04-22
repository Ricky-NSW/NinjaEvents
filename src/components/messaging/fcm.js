// fcm.js
import { messaging } from '../../FirebaseSetup';

messaging.onMessage((payload) => {
    console.log('Message received in foreground:', payload);
    // You can show a notification or update your app UI here
});

export async function requestNotificationPermission() {
    try {
        await Notification.requestPermission();
        const token = await messaging.getToken();
        console.log('FCM token:', token);
        return token;
    } catch (error) {
        console.error('Error getting FCM token:', error);
    }
}

