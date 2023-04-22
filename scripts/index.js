const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require("firebase-admin");

admin.initializeApp();

exports.createNotificationOnEventCreate = functions.firestore
    .document("events/{eventId}")
    .onCreate(async (snapshot, context) => {
      const event = snapshot.data();
      const eventId = context.params.eventId;

      // Fetch all users
      const usersSnapshot = await admin.firestore().collection("users").get();
      const batch = admin.firestore().batch();

      // Filter users who should receive a notification
      usersSnapshot.docs.forEach((userDoc) => {
        const userData = userDoc.data();
        const subscribedGyms = userData.subscribedGyms || [];
        const subscribedLeagues = userData.subscribedLeagues || [];

        if (
          subscribedGyms.includes(event.gym.id) ||
                (event.league && subscribedLeagues.includes(event.league.id))
        ) {
          const notificationRef = admin.firestore()
              .collection("users")
              .doc(userDoc.id)
              .collection("notifications")
              .doc();

          batch.set(notificationRef, {
            event: eventId,
            createdAt: admin.firestore.Timestamp.now(),
            unread: true,
          });
        }
      });

      // Commit the batch
      await batch.commit();

      console.log(`Created notifications for ${eventId}`);
    });
