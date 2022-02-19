const CHAT = {
    NODE: document.querySelector('.main__frame'),
    BUTTONS: {
        SETTINGS: document.querySelector('.main__frame .settings'),
        EXIT: document.querySelector('.main__frame .exit'),
    },
    SEND_FORM: document.forms.createMessage,
    DISPLAY: document.querySelector('.message__display'),
    TEMPLATE: document.querySelector('template.message'),
};

const AUTHORIZATION = {
    NODE: document.querySelector('.service__frame.authorization'),
    EXIT: document.querySelector('.service__frame.authorization .exit'),
    FORM: document.querySelector('.service__frame.authorization .service__content')
}

const CONFIRM = {
    NODE: document.querySelector('.service__frame.confirm'),
    EXIT: document.querySelector('.service__frame.confirm .exit'),
    FORM: document.querySelector('.service__frame.confirm .service__content')
}

const SETTINGS = {
    NODE: document.querySelector('.service__frame.settings'),
    EXIT: document.querySelector('.service__frame.settings .exit'),
    FORM: document.querySelector('.service__frame.settings .service__content')
}

export const UI = {
    CHAT, AUTHORIZATION, CONFIRM, SETTINGS,
}