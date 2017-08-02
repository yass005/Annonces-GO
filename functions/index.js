const functions = require('firebase-functions');
//const geolocation = require('node-geolocation');
const NodeGeocoder = require('node-geocoder');
const nodemailer = require('nodemailer');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

var mailOptions = {
   from: 'badrenyassine@gmail.com',
   to: 'badrenyassine@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};
const options = {
  provider: 'google',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyAtWwBc4doPXuI2VWMp_0U3_wEmrGENrdE', // for Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.createProfile = functions.auth.user().onCreate(event => {

  return admin.database().ref(`/userProfile/${event.data.uid}`).set({
    firstName: "",
    lastName: "",
    birthDate: "",
    adress: {
      rue: "",
      numéro: "",
      ville: ""
    },
    position: {
      Lat: "",
      Long: ""
    },
    email: event.data.email

  }).then( res => {
    transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  }).catch( err => {
    console.log(err);
  });


});


exports.cleanupUserData = functions.auth.user().onDelete(event => {
  const uid = event.data.uid;
  return admin.database().ref(`/userProfile/${uid}`).remove();
});

exports.newPost = functions.database.ref('/userProfile/{userId}/Annonces/{AnnoncesId}').onCreate(event => {

  let loc;
  /* if (event.data.previous.exists()) {
        return;
      }*/
  // Exit when the data is deleted.
  if (!event.data.exists()) {
    return;
  }

  const adress = event.data.ref.parent.parent.child('adress');

  adress.once("value")
    .then(snapshot => {
      rue = snapshot.child("rue").val(); // {first:"Ada",last:"Lovelace"}
      numéro = snapshot.child("numéro").val(); // "Ada"
      ville = snapshot.child("ville").val(); // "Lovelace"
      Geo = rue + " " + rue + " " + ville;
      return geocoder.geocode(Geo)
    })
    .then(res => {
      return event.data.ref.update({
        location: {
          Lat: res[0].latitude,
          Long: res[0].longitude
        },
        //  Adress: adress
        //  location1: {Lat: res.lat , Long : loc.lon}
      })
    }).catch(err => console.log(err))

  /* const path = event.data.ref

   // only execute function on creation


     return event.data.ref.update(
       {
       location: {Lat: loc.lat , Long : loc.lon}
       }

   )*/

});
