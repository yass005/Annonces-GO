
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

        admin.database().ref(`/AnnoncesAValidé/${event.data.key}`).update({
          location: {
            lat: res[0].latitude,
            lng: res[0].longitude
          },

        })
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))


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

  var eventSnapshot = event.data.val();

  admin.database().ref(`/categories/${eventSnapshot.categorie}/Annonces`).child(event.data.key).set(true);

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

      return admin.database().ref(`/AnnoncesAValidé/${snapshot.key}`).update({
        categorie: snapshot.child("categorie").val(),
        description: snapshot.child("description").val(),
        imageURL: snapshot.child("imageURL").val(),
        //   location: snapshot.child("location").val(),
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


exports.DeleteAnnonce = functions.database.ref('/userProfile/{userId}/Annonces/{AnnoncesId}').onDelete(event => {

  var eventSnapshot = event.data.previous.val();

  return admin.database().ref(`/Annonces/${event.data.key}`).remove().then(res =>
    console.log(res)
  ).then(()=>{
  return admin.database().ref(`/categories/${eventSnapshot.categorie}/Annonces`).child(event.data.key).remove();
  }).catch(err => {
    console.log(err);
  })
})


exports.sendWeightUpdate = functions.database.ref('/userProfile/{userId}/position').onWrite(event => {


  const UserId = event.params.userId;
  var UserPosition = event.data.val();
  var LastUserPosition = event.data.previous.val();
 if (getDistanceBetweenPoints(UserPosition, LastUserPosition, 'km' ) <= 0.5 ){
  return
 }
  const UserFavoris = event.data.ref.parent.child('Favoris');
  UserFavoris.once("value").then((snapshot) => {
    if (snapshot.exists()) {
      let favorisIDs =   Object.keys(snapshot.val())
      console.log(favorisIDs)
      return  admin.database().ref('/Annonces').once("value").then(Annonces => {

           Annonces.forEach(childSnapshot=> {
            console.log(childSnapshot.val(), UserPosition , childSnapshot.val().location )
          if (  favorisIDs.includes(childSnapshot.val().categorie) && childSnapshot.val().location && (getDistanceBetweenPoints(UserPosition, childSnapshot.val().location, 'km' ))<=0.5) {
            console.log(childSnapshot.val())
            const payload = {
              "notification":{
              "title": `une annonce qui vous interesse est a proximité `,
              "body": `${childSnapshot.val().titre}`,
              "sound":"default",
              },
              "data":{ "AnnonceId": childSnapshot.key }
              };

              event.data.ref.parent.child('token').once("value").then(token=> {
                console.log(token.val());
                return admin.messaging().sendToDevice(token.val(), payload).catch(err=> {
                  console.log(err);
                })
              })

          }
          })


      }).catch( err => {

    console.log(err);
      })

      // update
    } else {
        // Exit when the user dont have a list of favoris is deleted.
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
  const categoriesId= event.params.categoriesId;

  return admin.database().ref(`/userProfile/${UserId}/`).child('token').once("value").then(token=> {
    console.log(token.val());
      return admin.database().ref(`/categories/${categoriesId}/UsersTokens`).child(token.val()).set(true)
  }).catch(err=>{
    console.log(err);
  })

})


exports.DeleteUserToker = functions.database.ref('/userProfile/{userId}/Favoris/{categoriesId}').onDelete(event => {

  const UserId = event.params.userId;
  const categoriesId= event.data.previous.key;

   admin.database().ref(`/userProfile/${UserId}/`).child('token').once("value").then(token=> {
    return admin.database().ref(`/categories/${categoriesId}/UsersTokens/${token.val()}`).remove()
  }).catch(err => {
    console.log(err)
  })

})

exports.NotifUserFavoris = functions.database.ref('/categories/{categoriesId}/Annonces/{AnnonceId}').onWrite(event => {


   //exit when data is deleted
  if (!event.data.exists()) {
    return;
  }


  const categoriesId= event.params.categoriesId;
  const AnnonceId = event.params.AnnonceId;
  var Tokens = event.data.ref.parent.parent.child('UsersTokens');

  Tokens.once("value").then((snapshot) => {

    if (snapshot.exists()) {
      admin.database().ref(`/categories/${categoriesId}`).child('nom').once("value").then(nom=> {

        let payload = {
          "notification":{
          "title": `une nouvelle annonce vient d'être ` ,
          "body": `une annonce dans ${nom.val()}`,
          "sound":"default",
          },
          "data":{ "AnnonceId": AnnonceId}
          };

        return payload

      }).then( payload => {
        const ListeTokes =   Object.keys(snapshot.val())
        return admin.messaging().sendToDevice(ListeTokes, payload).catch(err => {
          console.log(err);
        })
      }).catch(err => {
        console.log(err);
      })

  }
  else {
    return;
  }

}).catch(err=> {
  console.log(err);
})

})


function getDistanceBetweenPoints( UserPosition, Destination, units)

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

       return  d


  }



  function toRad(x)
  {
    return x * Math.PI / 180;
  }


/*exports.deletePost = functions.database.ref('Posts/{pushId}').onWrite(event => {

  const original = event.data.val()
  const previous = event.data.previous.val()
  const pushId = event.params.pushId

  if (original === null)
    return

  const filePath = 'Posts/' + pushId + 'thumbnail.jpg'
  const bucket = gcs.bucket('postsapp-12312')
  const bucket = gcs.bucket(functions.config().firebase.storageBucket)
  const file = bucket.file(filePath)
  const pr = file.delete()


  return pr
});*/
