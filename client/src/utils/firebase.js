import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'




// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)


// ➤ Add Emergency Contact
export const addEmergencyContact = async (userId, contactData) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "emergencyContacts"),
      contactData
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding emergency contact:", error);
    throw error;
  }
};

// ➤ Fetch Emergency Contacts
export const getEmergencyContacts = async (userId) => {
  try {
    const snapshot = await getDocs(
      collection(db, "users", userId, "emergencyContacts")
    );

    let contacts = [];
    snapshot.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() });
    });

    return contacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

// ➤ Delete Contact
export const deleteEmergencyContact = async (userId, contactId) => {
  try {
    await deleteDoc(
      doc(db, "users", userId, "emergencyContacts", contactId)
    );
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};

export default app
