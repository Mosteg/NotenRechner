//Header
let userMenu;
let userIcon;
let userHover;
let userSelections;
let heading;

//Main


class UI  {
    constructor(callbacks) {
        this.callbacks = callbacks;

        this.initHeader();
        this.initMain();

    }

    initHeader() {
        userMenu = document.querySelector('.circle');
        userIcon = userMenu.querySelector('#userMenu');
        userHover = userMenu.querySelector('.click-area');
        userSelections = userMenu.querySelectorAll('.selection');
        heading = document.querySelector('header h1.title');


        userMenu.addEventListener('mouseover', e => {
            userIcon.classList.add('active');
            userHover.classList.add('active')
            console.log('test');
        });
        userMenu.addEventListener('mouseout', e => {
            userIcon.classList.remove('active');
            userHover.classList.remove('active')
        });

        userSelections[0].addEventListener('click', e => this.callbacks.logout());
        userSelections[1].addEventListener('click', e => window.open('einstellungen.html', '_self'));
        heading.addEventListener('click', e => window.open('index.html', '_self'));
    }

    initMain() {

    }

}

export {UI as default};