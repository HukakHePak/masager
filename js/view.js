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
    FORMS: {
        NAME: document.forms.chatName,
        MODE: document.forms.chatMode
    } 
}

export const UI = {
    CHAT, AUTH: AUTHORIZATION, CONFIRM, SETTINGS,
    active(node) {
        node?.classList.add('active');
    },
    
    isActive(node) {
        return node?.classList.contains('active');
    },

    deactive(node) {
        node?.classList.remove('active');
    }
}