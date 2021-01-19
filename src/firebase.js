import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyAtuhinmOSLwVS2Qi7EeuiELT1SjJfWBbI",
    authDomain: "freshgrown-b1de6.firebaseapp.com",
    databaseURL: "https://freshgrown-b1de6.firebaseio.com",
    projectId: "freshgrown-b1de6",
    storageBucket: "freshgrown-b1de6.appspot.com",
    messagingSenderId: "294689735939",
    appId: "1:294689735939:web:a5b65bbc88fd725aaa5536"
};
// Initialize Firebasefirebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export {
    db,
    auth
}

