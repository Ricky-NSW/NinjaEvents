// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
//
const functions = require("firebase-functions");
const {get} = require("lodash");
const admin = require("firebase-admin");

const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

admin.initializeApp();


// notify users when a new event is created
exports.createNotificationOnEventCreate = functions.region("australia-southeast1").firestore
    .document("events/{eventId}")
    .onCreate(async (snapshot, context) => {
      const event = snapshot.data();
      const eventId = context.params.eventId;
      const date = event.date;
      const gymName = event.gym.name;
      const eventTitle = event.title;

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
            type: "new_event",
            id: eventId,
            createdAt: admin.firestore.Timestamp.now(),
            status: "unread",
            date: date,
            gymName: gymName,
            eventTitle: eventTitle,
          });
        }
      });

      // Commit the batch
      await batch.commit();

      console.log(`Created notifications for ${eventId}`);
    });

// notify users when a new result is added to an event
exports.processEventResults = functions.region("australia-southeast1").firestore
    .document("events/{eventId}/results/{resultId}")
    .onCreate(async (snapshot, context) => {
      const eventId = context.params.eventId;
      const resultId = context.params.resultId;

      const resultData = snapshot.data();
      const results = get(resultData, "results", []);

      // Start a new batch
      const batch = admin.firestore().batch();

      // Fetch the event document
      const eventRef = admin.firestore().collection("events").doc(eventId);
      const eventDoc = await eventRef.get();
      const eventData = eventDoc.data();
      const eventName = eventData.title;
      const gymName = eventData.gym.name;

      function ordinalSuffix(i) {
        const j = i % 10;
        const k = i % 100;
        if (j === 1 && k !== 11) {
          return i + "st";
        }
        if (j === 2 && k !== 12) {
          return i + "nd";
        }
        if (j === 3 && k !== 13) {
          return i + "rd";
        }
        return i + "th";
      }


      // Iterate through the results array and process each item
      await Promise.all(results.map(async (resultItem, index) => {
        if (resultItem.id) {
          // The item has an id, meaning it is a user already in the database
          const userRef = admin.firestore().collection("users").doc(resultItem.id);

          // Add a result to the user's result array
          const resultRef = userRef.collection("results").doc();
          const resultData = {
            type: "event_result",
            eventId: eventId,
            resultId: resultId,
            resultPlace: ordinalSuffix(index + 1), // Use the ordinalSuffix function here
            eventName: eventName,
            gymName: gymName,
            message: `New results for ${eventName} at ${gymName} have been processed.`,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: "unread",
          };

          batch.set(resultRef, resultData);
        }
      }));

      // Commit the batch
      await batch.commit();

      console.log(`Processed event results and sent results for event ${eventName} at ${gymName}`);
    });

// handles images for gyms leagues and users
exports.resizeAvatar = functions.region("australia-southeast1").storage.object().onFinalize(async (object) => {

  const filePath = object.name;
  const fileName = path.basename(filePath);
  const tempLocalFile = path.join(os.tmpdir(), fileName);
  const tempLocalDir = path.dirname(tempLocalFile);
  const bucket = admin.storage().bucket(object.bucket);

  if (!filePath.startsWith("users/uploads/") && !filePath.startsWith("gyms/uploads/") && !filePath.startsWith("gyms/uploads/gallery/")) {
    console.log("Not an avatar or gallery image. Exiting...");
    return null;
  }

  if (fileName.includes("_200x200")) {
    console.log("Image is already resized. Exiting...");
    return null;
  }

  const uploadType = filePath.startsWith("users/uploads/") ? "users" : "gyms";

  await fs.promises.mkdir(tempLocalDir, {recursive: true});
  await bucket.file(filePath).download({destination: tempLocalFile});
  console.log("Image downloaded locally to", tempLocalFile);

  if (filePath.startsWith("gyms/uploads/gallery/")) {
    // Resize and compress gallery images
    const resizedFileName = `${fileName.split(".")[0]}_1024x1024.${fileName.split(".")[1]}`;
    const tempResizedLocalFile = path.join(os.tmpdir(), resizedFileName);
    await sharp(tempLocalFile).resize(1024, 1024, {fit: "inside"}).toFile(tempResizedLocalFile);
    console.log("Resized gallery image created at", tempResizedLocalFile);

    const uploadResizedFilePath = `${uploadType}/uploads/gallery/${object.metadata.uid}/${resizedFileName}`;
    await bucket.upload(tempResizedLocalFile, {destination: uploadResizedFilePath});

    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempResizedLocalFile);
    console.log("Resized gallery image uploaded to", uploadResizedFilePath);
  } else {
    // Resize avatars
    const resizedFileName = `${fileName.split(".")[0]}_200x200.${fileName.split(".")[1]}`;
    const tempResizedLocalFile = path.join(os.tmpdir(), resizedFileName);
    await sharp(tempLocalFile).resize(200, 200).toFile(tempResizedLocalFile);
    console.log("Resized avatar image created at", tempResizedLocalFile);

    const uploadResizedFilePath = `${uploadType}/uploads/${object.metadata.uid}/${resizedFileName}`;
    await bucket.upload(tempResizedLocalFile, {destination: uploadResizedFilePath});

    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempResizedLocalFile);
    console.log("Resized avatar image uploaded to", uploadResizedFilePath);
  }

  return null;
});

exports.scheduledFunction = functions.pubsub.schedule("0 20 * * *").timeZone("Australia/Sydney").onRun(async (context) => {
  // Your code to check Firestore documents and trigger actions based on the date

  const firestore = admin.firestore();
  const now = new Date();

  // Query events with a date field that match the current date
  const querySnapshot = await firestore.collection("events")
      .where("date", "<=", now)
      .get();

  // Start a new batch
  const batch = admin.firestore().batch();

  querySnapshot.forEach((doc) => {
    const eventData = doc.data();
    // Update the event document with the status field set to 'expired'
    const eventRef = firestore.collection("events").doc(doc.id);
    batch.update(eventRef, {status: "expired"});
  });

  // Commit the batch
  await batch.commit();

  console.log("Updated events with expired dates");
});

