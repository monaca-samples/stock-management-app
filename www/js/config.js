/* - - - - - - - - - - - - - - - - - - - - - - 
   Configurations for the Firebase Database
- - - - - - - - - - - - - - - - - - - - - - -  */
let db = null;
let useDatabaseApi = false;

// Firebase configuration and initialization
// const initFirebase = () => {
//   const firebaseConfig = {
//     apiKey: "PUT_YOUR_KEY_HERE",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "PROJECT_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID",
//     measurementId: "YOUR_MEASUREMENT_ID"
//   };

//   firebase.initializeApp(firebaseConfig);
//   db = firebase.firestore();
// };

/* - - - - - - - - - - - - - - - - - - - - - - - -
   Configurations for the Yahoo Barcode Lookup
- - - - - - - - - - - - - - - - - - - - - - - - -  */
const yahooApiKey = false; // set it to false or 'PUT_YOUR KEY_HERE' if you want to use yahooApi