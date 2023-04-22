import { getAuth } from "../../FirebaseSetup";
import { doc, setDoc, getFirestore } from "firebase/firestore";

// TODO: check that the user is logged in, if not tell them to log in
//     we should also hide the menu item
async function updateUserData(uid, data) {
    const db = getFirestore();

    try {
        const userDocRef = doc(db, "users", uid);
        await setDoc(userDocRef, data, { merge: true });
        console.log("User data updated successfully");
    } catch (error) {
        console.error("Error updating user data:", error);
    }
}

export default updateUserData;
