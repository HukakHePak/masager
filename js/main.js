import { UI } from './view.js';
import { cookie } from './cookies.js';

const messageForm = UI.CHAT.SEND_FORM;

messageForm.addEventListener('submit', event => {
    const msgText = messageForm.elements.newMessage.value;

    if(!msgText) {
        event.preventDefault();
        return;
    }

    const msgNode = UI.CHAT.TEMPLATE.content.cloneNode(true);

    msgNode.querySelector('.content').textContent = msgText;

    msgNode.querySelector('.time').textContent = getTime();

    UI.CHAT.DISPLAY.prepend(msgNode);

    messageForm.reset();
    event.preventDefault();
});

function getTime() {
    const date = new Date();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
}

function closeTabs() {
    for(let w in UI) {
        UI[w].NODE?.classList.remove('active');
    }
}

function openTab(select) {
    let tab = undefined;

    switch(select) {
        case 'chat':
            tab = UI.CHAT.NODE;
            break;

            case 'auth':
                tab = UI.AUTHORIZATION.NODE;
                break;

                case 'confirm':
                    tab = UI.CONFIRM.NODE;
                    break;
                    
                    case 'settings':
                        tab = UI.SETTINGS.NODE;
    };

    closeTabs();
    tab?.classList.add('active');
}

UI.CHAT.BUTTONS.SETTINGS.addEventListener('click', () => {
    openTab('settings');
});

UI.CHAT.BUTTONS.EXIT.addEventListener('click', () => {
    cookie.saveToken();
    openTab('auth');
});

[ UI.AUTHORIZATION, UI.CONFIRM ].forEach( item => {
    item.EXIT.addEventListener('click', closeTabs);
});

UI.SETTINGS.EXIT.addEventListener('click', () => {
    openTab('chat');
});

const authForm = UI.AUTHORIZATION.FORM;

authForm.addEventListener('submit', async event => {
    event.preventDefault();

    const email = authForm.elements.mail.value;

    if(!email) return;

    const request = await fetch('https://chat1-341409.oa.r.appspot.com/api/user', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ email })
    });

    if(!request.ok) {
        authForm.reset();
        return;
    }

    openTab('confirm');
});

UI.CONFIRM.FORM.addEventListener('submit', event => {
    event.preventDefault();

    cookie.saveToken(UI.CONFIRM.FORM.elements.code.value);

    openTab('chat');
});

UI.SETTINGS.FORM.addEventListener('submit', async event => {
    event.preventDefault();

    const name = UI.SETTINGS.FORM.elements.newName.value;

    console.log(name)

    if(!name) return;

    const request = await fetch('https://chat1-341409.oa.r.appspot.com/api/user', { 
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${ cookie.getToken() }`,
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ name })
    });

    if(!request.ok) {
        UI.SETTINGS.FORM.reset();
        return;
    }

    openTab('chat');
});

openTab(cookie.getToken() ? 'chat' : 'auth');