const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.createProfile = functions.auth.user().onCreate( event => {
 return admin.database().ref(`/userProfile/${event.data.uid}`).set({
    firstName: event.data.firstName,
    lastName: event.data.lastName,
    birthDate: event.data.birthDate,
    adress: {rue: "", numéro: "", ville: ""},
    position: {Lat:"" , Long : ""},
    email:  event.data.email

  });
});
