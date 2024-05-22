import DBControl from "./db.js";
import Account from "./account.js";
import { EmailAuthCredential } from "firebase/auth/cordova";


let db;
init();

localStorage.setItem('email', 'maurice.stegmaier@gmail.com');
localStorage.setItem('password', 'test123');

function init() {
    db = new DBControl();
    if(localStorage.getItem('email') && localStorage.getItem('password')) {
        db.login(localStorage.getItem('email'), localStorage.getItem('password'))
            .then(message => {
                console.log(message, db.user);
                main();
            })
        .catch(err => {
            console.log(err);
            login();
        });
    }
    else {
        login();
    }
}

function login() {
    const account = new Account();
    account.showLogin().then(datenbank => {
        db = datenbank;
        console.log(db.user);
        main();
    })
}

function main() {
    //code nach dem anmelden

    console.log('hier kommt mein code');




}






