const admin = require('firebase-admin');

//admin.initializeApp();

var serviceAccount = require("./social-app-bulb-firebase-adminsdk-z7shu-5f9329cf33.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://social-app-bulb.firebaseio.com"
  });

const db = admin.firestore();

module.exports ={ admin, db }