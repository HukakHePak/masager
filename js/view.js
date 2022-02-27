const CHAT = {
    NODE: document.querySelector('.main__frame'),
    BUTTONS: {
        SETTINGS: document.querySelector('.main__frame .settings'),
        EXIT: document.querySelector('.main__frame .exit'),
        SCROLL: document.querySelector('.main__frame .message__scroll')
    },
    FORM: document.forms.createMessage,
    DISPLAY: document.querySelector('.message__display'),
    TEMPLATE: document.querySelector('template.message'),
    SOUND: document.querySelector('audio'),
    STORY: document.querySelector('.story__end'),
    
};

const AUTHORIZATION = {
    NODE: document.querySelector('.service__frame.authorization'),
    EXIT: document.querySelector('.service__frame.authorization .exit'),
    FORM: document.forms.authorizationMail
}

const CONFIRM = {
    NODE: document.querySelector('.service__frame.confirm'),
    EXIT: document.querySelector('.service__frame.confirm .exit'),
    FORM: document.forms.confirmCode
}

const SETTINGS = {
    NODE: document.querySelector('.service__frame.settings'),
    EXIT: document.querySelector('.service__frame.settings .exit'),
    FORM: document.forms.chatName,
    BUTTONS: {
        LIGHT: document.querySelector('.service__frame .light__mode'),
        DARK: document.querySelector('.service__frame .dark__mode'),
    }
}

const HTML = document.querySelector('html');
const VIDEO = document.querySelector('.dark-mode__video');

export const UI = {
    CHAT, AUTH: AUTHORIZATION, CONFIRM, SETTINGS, HTML,

    active(node) {
        node?.classList.add('active');
    },
    
    isActive(node) {
        return node?.classList.contains('active');
    },

    deactive(node) {
        node?.classList.remove('active');
    },

    darkin() {
        HTML.classList.add('dark');
        UI.active(VIDEO);
        localStorage.setItem('mode', 'dark');
    },

    lightin() {
        HTML.classList.remove('dark');
        UI.deactive(VIDEO);
        localStorage.setItem('mode', '');
    }
}