import firebase from 'firebase/app'
import 'firebase/messaging'
import 'firebase/firestore'
import { isSafari } from 'react-device-detect'

// export const firebaseConfig = {
//     apiKey: "AIzaSyChMOheDbzQwDhL3osJWaY5pW4nTNCVBEs",
//     authDomain: "tradecorpcms.firebaseapp.com",
//     projectId: "tradecorpcms",
//     storageBucket: "tradecorpcms.appspot.com",
//     messagingSenderId: "567306234156",
//     appId: "1:567306234156:web:ac7ea191b99beeb5a56489",
//     measurementId: "G-RY4QRBZMVN"
// }

export const firebaseConfig = {
    apiKey: "AIzaSyD3fzUNdadV3wJjXLd0j00_CRTwJbIfjlw",
    authDomain: "tci-trucking.firebaseapp.com",
    databaseURL: "https://tci-trucking.firebaseio.com",
    projectId: "tci-trucking",
    storageBucket: "tci-trucking.appspot.com",
    messagingSenderId: "921358057258",
    appId: "1:921358057258:web:b8b613a6ded5db0ade6853",
    measurementId: "G-LTTV5G3BYY"
}

if (!isSafari) {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
    }
}

export const firebaseNotification = () => {
    if (!isSafari) {
        const messaging = firebase.messaging()
        return new Promise((resolve, reject) => {
            messaging.requestPermission()
            .then(() => messaging.getToken())
            .then((firebaseToken) => {
                resolve(firebaseToken)
            })
            .catch((err) => {
                reject(err)
            })
        })
    } else {
        return new Promise((resolve) => {
            resolve(null)
        })
    }
}

export const messageListener = () => {
    if (!isSafari) {
        const messaging = firebase.messaging()
        return new Promise((resolve) => {
            messaging.onMessage((payload) => {
                resolve(payload)
            })
        })
    } else {
        return new Promise((resolve) => {
            resolve(null)
        })
    }
}

export const db = () => {
    if (!isSafari) {
        return firebase.firestore()
    } else {
        return null
    }
}

export const insertData = () => {
    var db = firebase.firestore();

    db.collection("drivers").add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
    }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
}