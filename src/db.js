import {initializeApp} from "firebase/app";
import {getFirestore, collection, query, where, onSnapshot, getDocs, getDoc, addDoc, deleteDoc, doc, Timestamp} from "firebase/firestore"
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";

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
    constructor() {
        this.user = undefined;
        this.userDB = undefined;
        this.data = [];
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    this.user = userCredential.user;
                    this.userDB = collection(db, this.user.uid);
                    const subjects = query(this.userDB, where('type', '==', 'subject'));

                    localStorage.setItem('email', email);
                    localStorage.setItem('password', password);

                    return getDocs(subjects);
                })
                .then(snapshot => {
                    snapshot.docs.forEach(doc => this.data.push(doc.data()));
                    resolve('User singed in and subjects loaded');
                })
            .catch(err => reject(err));
        });
    }

    register(data) {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(auth, data.email, data.password)
                .then(userCredential => {
                    console.log('Created new User');
                    
                    this.user = userCredential.user;
                    const userDetails = {
                        type: "UserDetails",
                        firstname: data.firstname,
                        lastname: data.lastname
                    };
                    this.userDB = collection(db, this.user.uid);
                    addDoc(this.userDB, userDetails)
                        .then(() => console.log('User details added'))
                    .catch(err => reject(err));

                    localStorage.setItem('email', data.email);
                    localStorage.setItem('password', data.password);

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

    logout() {
        this.user = undefined;
        this.userDB = undefined;
        this.data = [];

        localStorage.removeItem('email');
        localStorage.removeItem('password');
        console.log('User loged out')
    }

    async sendPasswordResetEmail(email) {
        console.log(email);
        await sendPasswordResetEmail(auth, email);
        return 'Email send if email is in use';
    }
}

export {DBControl as default}