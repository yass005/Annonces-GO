const functions = require('firebase-functions');
//const geolocation = require('node-geolocation');
const NodeGeocoder = require('node-geocoder');
var nodemailer = require('nodemailer');
const gcs = require('@google-cloud/storage')();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'badrenyassine@gmail.com',
    pass: 'poloman121'
  }
});

var mailOptions = {
  from: 'badrenyassine@gmail.com',
  to: 'yassine.badren@heig-vd.ch',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};
const options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyAtWwBc4doPXuI2VWMp_0U3_wEmrGENrdE', // for Mapquest, OpenCage, Google Premier
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

  }).then(res => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }).catch(err => {

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

 /* var eventSnapshot = event.data.val();
  var uid = event.auth.variable ? event.auth.variable.uid : null;
  admin.database().ref(`/AnnoncesAValidé/${event.data.key}`).set({
    categorie: eventSnapshot.categorie,
    description: eventSnapshot.description,
    imageURL: eventSnapshot.imageURL,
    location: eventSnapshot.location,
    userId: uid,
    titre: eventSnapshot.titre

  }).then(res => {

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }).catch(err => {

    console.log(err);
  });*/


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


exports.newAnnonces = functions.database.ref('/AnnoncesAValidé/{AnnoncesId}/validé').onCreate(event => {



//admin.database.ref('userProfile'/snapshot.child("userId").val()/Annonces/${snapshot.key/imageURL).

  var Annonce = event.data.ref.parent
  Annonce.once("value")
    .then(snapshot => {
      return admin.database().ref(`/Annonces/${snapshot.key}`).set({
        categorie: snapshot.child("categorie").val(),
        description: snapshot.child("description").val(),
        imageURL: snapshot.child("imageURL").val(),
        location: snapshot.child("location").val(),
        userId: snapshot.child("userId").val(),
        titre: snapshot.child("titre").val()
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))

})


exports.finishValidate = functions.database.ref('/Annonces/{AnnoncesId}').onCreate(event => {

  return admin.database().ref(`/AnnoncesAValidé/${event.data.key}`).remove().then(res =>
    console.log(res)
  ).catch(err => {

    console.log(err);
  })

})

exports.UpdateImage = functions.database.ref('/userProfile/{userId}/Annonces/{AnnoncesId}/imageURL').onUpdate(event => {

 var Annonce = event.data.ref.parent
 var uid = event.auth.variable ? event.auth.variable.uid : null;
   Annonce.once("value")
    .then(snapshot => {

      return admin.database().ref(`//AnnoncesAValidé//${snapshot.key}`).set({
        categorie: snapshot.child("categorie").val(),
        description: snapshot.child("description").val(),
        imageURL: snapshot.child("imageURL").val(),
        location: snapshot.child("location").val(),
        userId: uid,
        titre: snapshot.child("titre").val()
      }).then(res => {

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }).catch(err => {

    console.log(err);
  });


})

})
