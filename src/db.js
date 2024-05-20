import {initializeApp} from "firebase/app";
import {getFirestore, collection, query, where, onSnapshot, getDocs, getDoc, addDoc, deleteDoc, doc, Timestamp} from "firebase/firestore"
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDbzzLHIe38LK1H1QT3WUbfJkJsWQ-GK8w",
    authDomain: "notenrechner-1284f.firebaseapp.com",
    projectId: "notenrechner-1284f",
    storageBucket: "notenrechner-1284f.appspot.com",
    messagingSenderId: "161730050022",
    appId: "1:161730050022:web:16ad439bff8b1cf009c827"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

class DBControl {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.user = undefined;
        this.userDB = undefined;
        this.data = [];
    }

    login() {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(auth, this.email, this.password)
                .then(user => {
                    this.user = user.user;
                    this.userDB = collection(db, user._tokenResponse.localId);
                    const subjects = query(this.userDB, where('type', '==', 'subject'));
                    return getDocs(subjects);
                })
                .then(snapshot => {
                    snapshot.docs.forEach(doc => this.data.push(doc.data()));
                    resolve('User singed in and subjects loaded');
                })
            .catch(err => reject(err));
        });
    }
}

export {DBControl as default}