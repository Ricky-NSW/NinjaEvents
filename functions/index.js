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

const request = require("request");
const {v4: uuidv4} = require("uuid");

// const uuidv4 = require("uuid/v4");
const {Storage} = require("@google-cloud/storage");
const storage = new Storage();

const serviceAccount = require("./ninjaworld-c885a-firebase-adminsdk-sl3xn-1060c6ff0e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// notify users when a new event is created
exports.createNotificationOnEventCreate = functions.region("australia-southeast1").firestore
    .document("events/{eventId}")
    .onCreate(async (snapshot, context) => {
      const event = snapshot.data();
      const eventId = context.params.eventId;
      const date = event.date;
      const gymId = event.gymId;
      const eventTitle = event.title;

      // Fetch gym details
      const gymSnapshot = await admin.firestore().collection("gyms").doc(gymId).get();
      const gymData = gymSnapshot.data();
      const gymName = gymData.name;
      const gymSlug = gymData.slug;

      // Fetch all users
      const usersSnapshot = await admin.firestore().collection("users").get();
      const batch = admin.firestore().batch();

      // Filter users who should receive a notification
      usersSnapshot.docs.forEach((userDoc) => {
        const userData = userDoc.data();
        const subscribedGyms = userData.subscribedGyms || [];
        const subscribedLeagues = userData.subscribedLeagues || [];

        if (
            subscribedGyms.includes(gymId) ||
            (event.leagueId && subscribedLeagues.includes(event.leagueId))
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
            gymSlug: gymSlug,
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
      const gymSlug = eventData.gym.slug;

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
            eventDate: eventData.date,
            gymName: gymName,
            gymSlug: gymSlug,
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

// handles avatar images for gyms leagues and users
exports.resizeAvatar = functions.region("australia-southeast1").storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const fileName = path.basename(filePath);
  const tempLocalFile = path.join(os.tmpdir(), fileName);
  const tempLocalDir = path.dirname(tempLocalFile);
  const bucket = admin.storage().bucket(object.bucket);

  console.log("Processing file:", filePath);
  console.log("Object metadata:", object.metadata);
  console.log("Object metadata id:", object.metadata.id);

  if (object.metadata && object.metadata.id) {
    console.log("Object metadata id:", object.metadata.id);
  } else {
    console.error("No custom metadata or id found.");
  }

  if (!filePath.startsWith("users/") && !filePath.startsWith("gyms/") && !filePath.startsWith("leagues/")) {
    console.log("This image doesn't meet the criteria of the 3 types. Exiting...");
    return null;
  }

  if (fileName.includes("_200x200")) {
    console.log("Image is already resized. Exiting...");
    return null;
  }

  let uploadType;
  if (filePath.startsWith("users/")) {
    uploadType = "users";
  } else if (filePath.startsWith("gyms/")) {
    uploadType = "gyms";
  } else if (filePath.startsWith("leagues/")) {
    uploadType = "leagues";
  } else {
    console.error("Invalid file path: does not start with 'users/', 'gyms/', or 'leagues/'.");
    return null;
  }

  console.log("Image upload type determined as:", uploadType);

  await fs.promises.mkdir(tempLocalDir, {recursive: true});
  console.log("Temporary local directory created:", tempLocalDir);

  try {
    await bucket.file(filePath).download({destination: tempLocalFile});
    console.log("Image downloaded locally to", tempLocalFile);
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }

  if (filePath.includes("/gallery/")) {
    const resizedFileName = `${fileName.split(".")[0]}_1024x1024.${fileName.split(".")[1]}`;
    const tempResizedLocalFile = path.join(os.tmpdir(), resizedFileName);

    try {
      await sharp(tempLocalFile).resize(1024, 1024, {fit: "inside"}).toFile(tempResizedLocalFile);
      console.log("Resized gallery image created at", tempResizedLocalFile);
    } catch (error) {
      console.error("Error resizing gallery image:", error);
      return null;
    }

    const uploadResizedFilePath = `${uploadType}/${object.metadata.id}/gallery/${resizedFileName}`;
    await bucket.upload(tempResizedLocalFile, {destination: uploadResizedFilePath});

    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempResizedLocalFile);
    console.log("Resized gallery image uploaded to", uploadResizedFilePath);
  } else {
    // assume it's an avatar image
    // Creating 200x200 avatar image
    const resizedFileName = `${fileName.split(".")[0]}_200x200.${fileName.split(".")[1]}`;
    const tempResizedLocalFile = path.join(os.tmpdir(), resizedFileName);

    try {
      await sharp(tempLocalFile).resize(200, 200, {fit: "inside"}).toFile(tempResizedLocalFile);
      console.log("Resized avatar image created at", tempResizedLocalFile);
    } catch (error) {
      console.error("Error resizing avatar image:", error);
      return null;
    }

    // Creating 35x35 avatar image
    const smallResizedFileName = `${fileName.split(".")[0]}_35x35.${fileName.split(".")[1]}`;
    const smallTempResizedLocalFile = path.join(os.tmpdir(), smallResizedFileName);

    try {
      await sharp(tempLocalFile).resize(35, 35).toFile(smallTempResizedLocalFile);
      console.log("Small resized avatar image created at", smallTempResizedLocalFile);
    } catch (error) {
      console.error("Error resizing small avatar image:", error);
      return null;
    }

    // object.metadata.id works
    const id = object.metadata ? object.metadata.id : null;

    if (!id) {
      console.error("Invalid metadata: 'id' not present in customMetadata.");
      return null;
    }

    console.log("Received metadata id:", id);

    // Uploading 200x200 avatar
    const uploadResizedFilePath = `${uploadType}/${object.metadata.id}/avatar/${resizedFileName}`;
    await bucket.upload(tempResizedLocalFile, {destination: uploadResizedFilePath});

    // Uploading 35x35 avatar
    const smallUploadResizedFilePath = `${uploadType}/${object.metadata.id}/avatar/${smallResizedFileName}`;
    await bucket.upload(smallTempResizedLocalFile, {destination: smallUploadResizedFilePath});

    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempResizedLocalFile);
    fs.unlinkSync(smallTempResizedLocalFile);
    console.log("Resized avatar images uploaded to", uploadResizedFilePath, "and", smallUploadResizedFilePath);


    const file = bucket.file(uploadResizedFilePath);
    const smallFile = bucket.file(smallUploadResizedFilePath);

    // Make the file publicly accessible
    await file.makePublic();
    await smallFile.makePublic();

    // Generate a public URL for the files
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(uploadResizedFilePath)}`;
    const smallPublicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(smallUploadResizedFilePath)}`;

    // Update the document with the URL of the 200x200 avatar and the URL of the 35x35 avatar
    if (uploadType === "gyms") {
      await admin.firestore().collection("gyms").doc(id).update({
        avatarUrl: publicUrl,
        smallAvatarUrl: smallPublicUrl,
      });
    } else if (uploadType === "leagues") {
      await admin.firestore().collection("leagues").doc(id).update({
        avatarUrl: publicUrl,
        smallAvatarUrl: smallPublicUrl,
      });
    } else if (uploadType === "users") {
      await admin.firestore().collection("users").doc(id).update({
        avatarUrl: publicUrl,
        smallAvatarUrl: smallPublicUrl,
      });
    } else {
      console.error("Invalid upload type:", uploadType);
      return null;
    }
  }
  console.log("Image processing function completed.");
  return null;
});

// Update the event document with the status field set to 'expired' after event has happened
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


exports.saveGymImageToStorage = functions.region("australia-southeast1").firestore
    .document(`gyms/{gymId}`)
    .onCreate(async (snap, context) => {
      const gymData = snap.data();
      const gymId = context.params.gymId;

      if (gymData.scrapedImage && gymData.scrapedImage.startsWith("https://maps.googleapis.com/maps/api/place")) {
        const imageFileName = `${uuidv4()}.jpg`; // Or any image format supported by the Google Place API
        const tempImagePath = path.join(os.tmpdir(), imageFileName);
        const bucketName = "ninjaworld-c885a.appspot.com"; // Replace this with your bucket name

        // Download image from Google's Place API
        await new Promise((resolve, reject) => {
          request(gymData.scrapedImage)
              .pipe(fs.createWriteStream(tempImagePath))
              .on("error", reject)
              .on("finish", resolve);
        });

        // Upload image to Firebase Storage and make it public
        await storage.bucket(bucketName).upload(tempImagePath, {
          destination: `gyms/${gymId}/banner/${imageFileName}`,
          public: true, // Make the file public
        });

        // Construct the public URL
        const publicUrl = `https://storage.googleapis.com/${bucketName}/gyms/${gymId}/banner/${imageFileName}`;

        // Save the public URL to Firestore
        try {
          await admin.firestore().collection("gyms").doc(gymId).update({
            bannerUrl: publicUrl,
          });
          console.log(`Saved public URL to Firestore: ${publicUrl}`);
        } catch (error) {
          console.error("Failed to update Firestore", error);
        }

        // Remove temporary image file
        fs.unlinkSync(tempImagePath);
      }
    });



