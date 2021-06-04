import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

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
var functions = firebase.functions();
var storage = firebase.storage().ref();
if (window.location.hostname === 'localhost') {
    firebase.functions().useEmulator('localhost', 5001);
}
db.enablePersistence().catch(err => {
    console.log(err.code)
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
    }
})

//collections
const categoryCollection = db.collection("Categories")
const carouselCollection = db.collection("carousel")
const indipendentItemCollection = db.collection("independentItems")
const ItemCollection = db.collection("items")
const packageCollection = db.collection("packages")
const userCollection = db.collection("users")
const orders = db.collection("orders")
const AreaCollection = db.collection("Areas")
const locationCollection = db.collection("locations")
const adminCollection = db.collection("admin")
export {
    db,
    auth,
    functions,
    storage,
    adminCollection,
    categoryCollection,
    carouselCollection,
    indipendentItemCollection,
    packageCollection,
    userCollection,
    ItemCollection,
    orders,
    AreaCollection,
    locationCollection,
}

