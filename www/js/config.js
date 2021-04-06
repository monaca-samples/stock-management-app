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

const initFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyA6Q9GHEPm9sEUxi4zFJkdDnsu8K5-hg1U",
    authDomain: "monaca-stock-management.firebaseapp.com",
    projectId: "monaca-stock-management",
    storageBucket: "monaca-stock-management.appspot.com",
    messagingSenderId: "788776392831",
    appId: "1:788776392831:web:8ca3c8e735392adf26474a",
    measurementId: "G-B84QMRWKF5"
  };

    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  };

/* - - - - - - - - - - - - - - - - - - - - - - - -
   Configurations for the Yahoo Barcode Lookup
- - - - - - - - - - - - - - - - - - - - - - - - -  */
//const yahooApiKey = 'PUT_YOUR KEY_HERE';
const yahooApiKey = 'dj00aiZpPW40WFV4SDhDVnd2SSZzPWNvbnN1bWVyc2VjcmV0Jng9ZjA-'; 
