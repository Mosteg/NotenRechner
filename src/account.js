const regName = /^[a-zA-Z]{1,}$/;
const regEmail = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const regPassword = /^[^\s]{6,}$/;
 
class Account {
    constructor(db) {
        import ('./styles/account.css');
        this.body = document.querySelector('body');
        this.element;
        this.db = db;
    }

    showLogin() {
        const html = `
            <div class="login account">
                <div class="background">
                    <div class="field">
                        <form class="login-form" novalidate>
                            <p class="title">Login</p>
                            <input type="email" class="input" id="email" placeholder="Your email" autocomplete="off">
                            <input type="password" class="input" id="password" placeholder="Your password" autocomplete="off">
                            <p class="link" id="singupL">Sing Up</p>
                            <input type="submit" id="submit" value="Login">
                            <p class="forgotPassword" id="forgotPassword">Forgot Password?</p>
                            <p class="message" id="message"></p>
                        </form>
                    </div>
                </div>
            </div>
        `;
        this.body.innerHTML += html;
        this.element = this.body.querySelector('.login');
        const form = this.element.querySelector('form.login-form');
        const link = this.element.querySelector('#singupL');
        const forgotPassword = this.element.querySelector('#forgotPassword');
        const message = form.querySelector('#message');

        return new Promise(resolve => {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const data = {
                    email: e.target[0].value,
                    password: e.target[1].value,
                }

                this.testLogin(data)
                    .then(() => {
                        this.close();
                        resolve();
                    })
                .catch(feedback => message.textContent = feedback);
            });
            link.addEventListener('click', e => this.close().showSingUp().then(data => resolve(data)));
            forgotPassword.addEventListener('click', e => this.close().showForgotPassword().then(data => resolve(data)));
        });
    }

    showSingUp() {
        const html = `
            <div class="singup account">
                <div class="background">
                    <div class="field">
                        <form class="singup-form" novalidate>
                            <p class="title">Sing Up</p>
                            <input type="text" class="input" id="firstname" placeholder="Your first name" autocomplete="off">
                            <input type="text" class="input" id="lastname" placeholder="Your last name" autocomplete="off">
                            <input type="email" class="input" id="email" placeholder="Your email" autocomplete="off">
                            <input type="password" class="input" id="password" placeholder="Your password" autocomplete="off">
                            <input type="password" class="input" id="passwordConfirm" placeholder="Confirm your password" autocomplete="off">
                            <p class="link" id="loginL">Login</p>
                            <input type="submit" id="submit" value="Sing Up">
                            <p class="message" id="message"></p>
                        </form>
                    </div>
                </div>
            </div>
        `;
        this.body.innerHTML += html;
        this.element = document.querySelector('.singup');
        const form = document.querySelector('form.singup-form');
        const link = document.querySelector('#loginL');
        const message = form.querySelector('#message');

        return new Promise(resolve => {
            form.addEventListener('submit', e => {
                e.preventDefault();
                
                const data = {
                    email: e.target[2].value,
                    password: e.target[3].value,
                    passwordC: e.target[4].value,
                    firstname: e.target[0].value,
                    lastname: e.target[1].value
                };

                this.testSingUp(data, true)
                    .then(() => {
                        this.close(); 
                        resolve();
                    })
                .catch(feedback => {
                    message.textContent = feedback;
                    form.submit.classList.add('invalid');
                    form.submit.disabled = true;

                    form.addEventListener('keyup', e => {
                        const data = {
                            email: e.target.parentElement.email.value,
                            password: e.target.parentElement.password.value,
                            passwordC: e.target.parentElement.passwordConfirm.value,
                            firstname: e.target.parentElement.firstname.value,
                            lastname: e.target.parentElement.lastname.value
                        };

                        this.testSingUp(data)
                            .then(() => {
                                message.textContent = '';
                                form.submit.classList.remove('invalid');
                                form.submit.disabled = false;
                            })
                        .catch(feedback => {
                            message.textContent = feedback;
                            form.submit.classList.add('invalid');
                            form.submit.disabled = true;
                        });
                    }); 
                });
            });
            link.addEventListener('click', e => this.close().showLogin().then(data => resolve(data)));
        });
    }

    showForgotPassword() {
        const html = `
            <div class="forgotPassword account">
                <div class="background">
                    <div class="field">
                        <form class="forgotPassword-form" novalidate>
                            <p class="title">Forgot Password?</p>
                            <input type="email" class="input" id="email" placeholder="Your email" autocomplete="off">
                            <p class="link" id="loginL">Login</p>
                            <input type="submit" id="submit" value="Restet password">
                            <p class="message" id="message"></p>
                        </form>
                    </div>
                </div>
            </div>
        `;
        this.body.innerHTML += html;
        this.element = this.body.querySelector('.forgotPassword');
        const form = this.element.querySelector('form.forgotPassword-form');
        const link = this.element.querySelector('#loginL');
        const message = form.querySelector('#message');

        return new Promise(resolve => {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const email = e.target[0].value;
                if(regEmail.test(email)) {
                    message.classList.add('green');
                    message.textContent = 'Wenn die angegebene Email-Adresse existiert, erhalten Sie eine E-Mail, mit der Sie Ihr Passwort zurücksetzen können!';
                    this.db.sendPasswordResetEmail(email).then(message => console.log(message));
                    setTimeout(() => message.textContent = '', 4000);
                } 
                else {
                    form.submit.classList.add('invalid');
                    form.submit.disabled = true;
                    message.classList.remove('green');
                    if(email === '') message.textContent = 'Es wurde kein Email-Adresse eingegeben!';
                    else message.textContent = 'Die eingegebene Email-Adresse ist keine gültige Email-Adresse!';

                    form.addEventListener('keyup', e => {
                        const email = e.target.value;
                        console.log(email);
                        if(regEmail.test(email)) {
                            message.textContent = '';
                            form.submit.classList.remove('invalid');
                            form.submit.disabled = false;
                        }
                        else {
                            form.submit.classList.add('invalid');
                            form.submit.disabled = true;
                            message.classList.remove('green');
                            if(email === '') message.textContent = 'Es wurde kein Email-Adresse eingegeben!';
                            else message.textContent = 'Die eingegebene Email-Adresse ist keine gültige Email-Adresse!';
                        }
                    });   
                }
            });
            link.addEventListener('click', e => this.close().showLogin().then(data => resolve(data)));
        });
    }

    close() {
        this.element.remove();
        return this;
    }

    testSingUp(data, submit = false) {
        return new Promise((resolve, reject) => {
            if(data.firstname === '') reject('Es wurde kein Vorname eingegeben!');
            else if(data.firstname === '') reject('Es wurde kein Nachname eingegeben!');
            else if(data.email === '') reject('Es wurde kein Email-Adresse eingegeben!');
            else if(data.password === '') reject('Es wurde kein Passwort eingegeben!');
            else if(data.passwordC === '') reject('Sie müssen ihr Password bestätigen!');
            else if(!regName.test(data.firstname)) reject('Der eingegebene Vorname ist nicht gültig. Verwenden sie nur Buchstaben!');
            else if(!regName.test(data.lastname)) reject('Der eingegebene Nachname ist nicht gültig. Verwenden sie nur Buchstaben!');
            else if(!regEmail.test(data.email)) reject('Die eingegebene Email-Adresse ist keine gültige Email-Adresse!');
            else if(!regPassword.test(data.password)) reject('Das eingegebene Passwort ist nicht gültig! (keine Leerzeichen / mindestens 6 Zeichen)');
            else if(data.password !== data.passwordC) reject('Die eingegebenen Passwörter stimmen nicht überein');
            else if(submit) {
                this.db.register(data)
                    .then(message => {
                        console.log(message);
                        resolve();
                    })
                .catch(err => {
                    const errorCode = err.code;
                    let errorMessage;
                    console.log(err);
                    switch (errorCode) {
                        case 'auth/email-already-in-use':
                            errorMessage = 'Diese E-Mail-Adresse ist bereits vergeben. Bitte verwenden Sie eine andere E-Mail-Adresse.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Die eingegebene E-Mail-Adresse ist ungültig. Bitte überprüfen Sie die E-Mail-Adresse und versuchen Sie es erneut.';
                            break;
                        case 'auth/weak-password':
                            errorMessage = 'Das eingegebene Passwort ist zu schwach. Bitte wählen Sie ein stärkeres Passwort.';
                            break;
                        default:
                            errorMessage = 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
                            console.log(err);
                    }
                    
                reject(errorMessage);
                });
            }
            else resolve();
        });
    }

    testLogin(data) {
        return new Promise((resolve, reject) => {
            this.db.login(data.email, data.password)
                .then(message => {
                    console.log(message);
                    resolve();
                })
            .catch(err => {
                const errorCode = err.code;
                let errorMessage;

                switch (errorCode) {
                case 'auth/invalid-credential':
                    errorMessage = 'Die E-Mail-Adresse oder das Passwort ist ungültig. Bitte versuchen Sie es erneut.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Die eingegebene E-Mail-Adresse ist ungültig. Bitte überprüfen Sie die E-Mail-Adresse und versuchen Sie es erneut.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Es existiert kein Benutzerkonto mit dieser E-Mail-Adresse. Bitte überprüfen Sie die E-Mail-Adresse oder registrieren Sie sich.';
                    break;
                case 'auth/invalid-password':
                    errorMessage = 'Das eingegebene Passwort ist falsch. Bitte überprüfen Sie Ihr Passwort und versuchen Sie es erneut.';
                    break;
                case 'auth/missing-password':
                    errorMessage = 'Sie haben kein Passwort eingegeben.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
                    break;

                default:
                    errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
                    console.log(err);
                }

                reject(errorMessage);
            });
        });
    }
}

export {Account as default};