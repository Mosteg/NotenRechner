import DBControl from "./db.js";
import Account from "./account.js";
import UI from "./ui.js";
import ('./styles/body.css');
import ('./styles/header.css');

const db = new DBControl();
const loadingscreen = document.querySelector('body div.loading')

addEventListener('load', () => init());

function init() {
    //in localSorage den nutzer speichern und nicht email und password
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
    loadingscreen.classList.add('done');
    let account = new Account(db);
    account.showLogin().then(() => {
        console.log(db.user);
        document.querySelector('link[href*="/assets/src_styles_account_css.css"]').remove();
        main();
    })
}
function logout() {
    db.logout();
    location.reload();
};

function main() {
    loadingscreen.classList.remove('done');
    //---------------------------------------------------------------------------------------------------
    console.log('hier kommt mein code');
    //code nach dem anmelden
    const ui = new UI({logout});




    //---------------------------------------------------------------------------------------------------
    loadingscreen.classList.add('done');
}






