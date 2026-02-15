/*
╔══════════════════════════════════════════════════════════════════════════════╗
║   FIREBASE CONFIGURATION                                                     ║
║   Healthcare+ Authentication System                                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYGHn0mmHjcyKMEQaL2HjqXn17Ft-8n78",
    authDomain: "health-care-27cb2.firebaseapp.com",
    projectId: "health-care-27cb2",
    storageBucket: "health-care-27cb2.firebasestorage.app",
    messagingSenderId: "1044821410087",
    appId: "1:1044821410087:web:9761ef39334296218c6902",
    measurementId: "G-85MNDZBQRQ"
};

// Initialize Firebase
let app, auth, db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Helper function to save user data to Firestore
async function saveUserToFirestore(user, additionalData = {}) {
    try {
        const userRef = db.collection('users').doc(user.uid);
        
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || additionalData.fullName || '',
            phoneNumber: user.phoneNumber || additionalData.phone || '',
            role: additionalData.role || 'patient',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            ...additionalData
        };
        
        await userRef.set(userData, { merge: true });
        console.log('✅ User data saved to Firestore');
        return userData;
    } catch (error) {
        console.error('❌ Error saving user to Firestore:', error);
        throw error;
    }
}

// Helper function to get user data from Firestore
async function getUserFromFirestore(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('❌ Error getting user from Firestore:', error);
        throw error;
    }
}

// Helper function to update last login
async function updateLastLogin(uid) {
    try {
        await db.collection('users').doc(uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('❌ Error updating last login:', error);
    }
}

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('✅ User is signed in:', user.email);
        // Update last login
        updateLastLogin(user.uid);
    } else {
        console.log('ℹ️ No user signed in');
    }
});

// Export for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.googleProvider = googleProvider;
window.saveUserToFirestore = saveUserToFirestore;
window.getUserFromFirestore = getUserFromFirestore;
window.updateLastLogin = updateLastLogin;

console.log('🔥 Firebase configuration loaded');
