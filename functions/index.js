/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*---------------------------Firebase cloud functions  -------------------------   */
/* fichier de functions                                                           */
/*-------------------------------------------------------------------------------*/
const functions = require('firebase-functions');
//const geolocation = require('node-geolocation');
const NodeGeocoder = require('node-geocoder');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
var nodemailer = require('nodemailer');
const gcs = require('@google-cloud/storage')();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//

//mail config for  test
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
// [START onCreateTrigger] create a new node from a new registred user
exports.createProfile = functions.auth.user().onCreate(event => {
  // event.data.uid The Firebase user.
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
    //send an email to the admin
    return sendEmail('new user', `a new user with ${event.data.email}`)
  }).catch(err => {

    console.log(err);
  });


});

//delete the user data after acount deleted
exports.cleanupUserData = functions.auth.user().onDelete(event => {
  const uid = event.data.uid;
  return admin.database().ref(`/userProfile/${uid}`).remove();
});
//Listen for data changes in the path /userProfile/{userId}/Annonces/{AnnoncesId}
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
      rue = snapshot.child("rue").val();
      numéro = snapshot.child("numéro").val();
      ville = snapshot.child("ville").val();
      Geo = rue + " " + rue + " " + ville;
      return geocoder.geocode(Geo)
    })
    .then(res => {
      return event.data.ref.update({
        location: {
          lat: res[0].latitude,
          lng: res[0].longitude
        },

      }).then(() => {

        return admin.database().ref(`/AnnoncesAValidé/${event.data.key}`).update({
          location: {
            lat: res[0].latitude,
            lng: res[0].longitude
          },

        })
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))


});

//Triggers when  the admin validate an annonces
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

//Triggers when the annonce has been add to online list and add the id to the categories and delete it from the
//AnnoncesAValidé(wait liste)
exports.finishValidate = functions.database.ref('/Annonces/{AnnoncesId}').onCreate(event => {

  var eventSnapshot = event.data.val();

  admin.database().ref(`/categories/${eventSnapshot.categorie}/Annonces`).child(event.data.key).set(true);

  return admin.database().ref(`/AnnoncesAValidé/${event.data.key}`).remove().then(res =>
    console.log(res)
  ).catch(err => {

    console.log(err);
  })

})


//Triggers when the user finish add annonce and add it to the wait list for validation
exports.UpdateImage = functions.database.ref('/userProfile/{userId}/Annonces/{AnnoncesId}/imageURL').onUpdate(event => {

  var Annonce = event.data.ref.parent
  var uid = event.auth.variable ? event.auth.variable.uid : null;
  Annonce.once("value")
    .then(snapshot => {

      return admin.database().ref(`/AnnoncesAValidé/${snapshot.key}`).update({
        categorie: snapshot.child("categorie").val(),
        description: snapshot.child("description").val(),
        imageURL: snapshot.child("imageURL").val(),
        //   location: snapshot.child("location").val(),
        userId: uid,
        titre: snapshot.child("titre").val()
      }).then(res => {

        return sendEmail('New Annonce', `Nouvelle annonce en attente de validation${snapshot.child("titre").val()}`)
      }).catch(err => {

        console.log(err);
      });


    })

})

/**
 * Triggers when a user delete an annonce from his acount and delete from the categorie and the online annonce
 * to keep the database consistency */
exports.DeleteAnnonce = functions.database.ref('/userProfile/{userId}/Annonces/{AnnoncesId}').onDelete(event => {

  var eventSnapshot = event.data.previous.val();
  const UserId = event.params.userId;

  return admin.database().ref(`/Annonces/${event.data.key}`).remove().then(res =>
    console.log(res)
  ).then(() => {
    return admin.database().ref(`/categories/${eventSnapshot.categorie}/Annonces`).child(event.data.key).remove();
  }).then(() => {

    return DeleteBucket(`/Users/${UserId}/${event.data.key}/Annonces.png`)
  }).catch(err => {
    console.log(err);
  })
})


/**
 * Triggers when   the position of the users changes and  some products  part of his favorites are nearby
 * and sends a notification to  users with the annonce id*/
exports.sendNotificationAnnonces = functions.database.ref('/userProfile/{userId}/position').onWrite(event => {

  const UserId = event.params.userId;
  var UserPosition = event.data.val();
  var LastUserPosition = event.data.previous.val();
  //fisrt check the distance between the new and lasposition should be greater than 500m
  if (getDistanceBetweenPoints(UserPosition, LastUserPosition, 'km') <= 0.5) {
    return
  }
  const UserFavoris = event.data.ref.parent.child('Favoris');
  UserFavoris.once("value").then((snapshot) => {
    //second check the must have some favoris
    if (snapshot.exists()) {
      let favorisIDs = Object.keys(snapshot.val())
      console.log(favorisIDs)
      return admin.database().ref('/Annonces').once("value").then(Annonces => {

        Annonces.forEach(childSnapshot => {
          console.log(childSnapshot.val(), UserPosition, childSnapshot.val().location)

          if (favorisIDs.includes(childSnapshot.val().categorie) && !(UserId === childSnapshot.val().userId) && childSnapshot.val().location &&
           (getDistanceBetweenPoints(UserPosition, childSnapshot.val().location, 'km')) <= 0.5) {
            console.log(childSnapshot.val())
            const payload = {
              "notification": {
                "title": `Une annonce qui vous interesse est a proximité `,
                "body": `${childSnapshot.val().titre}`,
                "icon": `${childSnapshot.val().imageURL}`,
                "sound": "default",
              },
              "data": {
                "AnnonceId": childSnapshot.key
              }
            };
            event.data.ref.parent.child('token').once("value").then(token => {
              console.log(token.val());
              return admin.messaging().sendToDevice(token.val(), payload).catch(err => {
                console.log(err);
              })
            }).catch(err => {
              console.log(err);
            })

          }
        })
      }).catch(err => {
        console.log(err);
      })
      // update
    } else {
      // Exit when the user dont have a list of favoris
      return;
    }
  });


});


exports.AddUserToker = functions.database.ref('/userProfile/{userId}/Favoris/{categoriesId}').onWrite(event => {


  //exit when data is deleted
  if (!event.data.exists()) {
    return;
  }

  const UserId = event.params.userId;
  const categoriesId = event.params.categoriesId;

  return admin.database().ref(`/userProfile/${UserId}/`).child('token').once("value").then(token => {
    console.log(token.val());
    return admin.database().ref(`/categories/${categoriesId}/UsersTokens`).child(token.val()).set(true)
  }).catch(err => {
    console.log(err);
  })

})


// Triggers when  a  user delete a  categoriesId from his favoris and delete his token from the
//categories/${categoriesId}/UsersTokens/

exports.DeleteUserToker = functions.database.ref('/userProfile/{userId}/Favoris/{categoriesId}').onDelete(event => {

  const UserId = event.params.userId;
  const categoriesId = event.data.previous.key;

  admin.database().ref(`/userProfile/${UserId}/`).child('token').once("value").then(token => {
    return admin.database().ref(`/categories/${categoriesId}/UsersTokens/${token.val()}`).remove()
  }).catch(err => {
    console.log(err)
  })

})


/**
 * Triggers when  a  new Annonces is add and sends a notification to intersted users
 *
 * Annonces is  add a flag to categories/{categoriesId}/Annonces/{AnnonceId}
 * Users save their device notification tokens to `/categories/{categoriesId}/UsersTokens/`.
 */
exports.NotifUserFavoris = functions.database.ref('/categories/{categoriesId}/Annonces/{AnnonceId}').onWrite(event => {

  //exit when data is deleted
  if (!event.data.exists()) {
    return;
  }

  const categoriesId = event.params.categoriesId;
  const AnnonceId = event.params.AnnonceId;
  var Tokens = event.data.ref.parent.parent.child('UsersTokens');

  Tokens.once("value").then((snapshot) => {

    if (snapshot.exists()) {
      admin.database().ref(`/categories/${categoriesId}`).child('nom').once("value").then(nom => {

        let payload = {
          "notification": {
            "title": `Nouvelle annonce dans `,
            "body": `${nom.val()}`,
            "sound": "default",
          },
          "data": {
            "AnnonceId": AnnonceId
          }
        };

        return payload

      }).then(payload => {
        const ListeTokes = Object.keys(snapshot.val())
        return admin.messaging().sendToDevice(ListeTokes, payload).catch(err => {
          console.log(err);
        })
      }).catch(err => {
        console.log(err);
      })

    } else {
      return;
    }

  }).catch(err => {
    console.log(err);
  })

})

//haversine  formula  calculates the distance between two geo coordinates
// userposition is the position of the user and Destination is the annonce geo coordinates
function getDistanceBetweenPoints(UserPosition, Destination, units)

{
  let earthRadius = {
    miles: 3958.8,
    km: 6371
  };
  let R = earthRadius[units || 'km'];
  let lat1 = UserPosition.lat;
  let lon1 = UserPosition.lng;
  let lat2 = Destination.lat;
  let lon2 = Destination.lng;

  let dLat = toRad((lat2 - lat1));
  let dLon = toRad((lon2 - lon1));
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d

}
// convert degre to radian
function toRad(x) {
  return x * Math.PI / 180;
}

// delete a file from the firebase.storageBucket
function DeleteBucket(filePath) {
  const bucket = functions.config().firebase.storageBucket
  const myBucket = gcs.bucket(bucket);
  const file = myBucket.file(filePath);
  console.log(`${myBucket},${filePath}, ${file}`)
  file.exists().then(() => {
    return file.delete()
  })

}

// Sends  email to the admin
function sendEmail(subject, Message) {
  const mailOptions = {
    from: 'badrenyassine@gmail.com',
    to: 'samuel.loche@nospages.com',
    subject: subject,
    text: Message
  };
  // The user subscribed to the newsletter.
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New  email sent to:');
  });
}
