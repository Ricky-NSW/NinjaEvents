importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyC7N_T7Pze4DDRFENV8bN5seMmhyrsNCCw",
    authDomain: "ninjaworld-c885a.firebaseapp.com",
    projectId: "ninjaworld-c885a",
    storageBucket: "ninjaworld-c885a.appspot.com",
    messagingSenderId: "345924605674",
    appId: "1:345924605674:web:da38312b5ff9cb76efe993",
    measurementId: "G-TSPM11TJLF"
});

const messaging = firebase.messaging();

// Optional: Add custom logic for handling the notification here.
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/path/to/icon.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
