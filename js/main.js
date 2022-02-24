import { UI } from './view.js';
import { Cookie, AGE } from './cookie.js';
import { request, URLS } from './api.js';
import { message } from './messages.js';
import { Popup } from './popup.js';
import { formatDate } from './time.js';
import { SocketHandler } from './socket.js';

const POPUPS = {
    SETTINGS: new Popup(UI.SETTINGS.NODE),
    AUTH: new Popup(UI.AUTH.NODE),
    CHAT: new Popup(UI.CHAT.NODE),
    CONFIRM: new Popup(UI.CONFIRM.NODE),
};

const COOKS = {
    TOKEN: new Cookie('token'),
    MAIL: new Cookie('mail'),
};

const chatSocket = new SocketHandler( event => { 
    createMessage(JSON.parse(event.data));
    UI.CHAT.SOUND.play();   // отключить уведомления от мёеня
 } );

function createMessage(data) {    // перенести в messages.js
    try {   
        const name = COOKS.MAIL.get() == data.user.email ? undefined : data.user.name;

        message.print(data.text, formatDate(data.createdAt), name);
    } catch (e) {
        e.message = 'uncorrect data'
        console.error(e);
    }
}

function tokenedRequest(url, method, body) {
    return request(url, { method, body, headers: { Authorization: `Bearer ${ COOKS.TOKEN.get() }`} });
}

function formHandler(handling) {
    return event => {
        event.preventDefault();
        handling(event);
        event.target.reset();
    }
}

UI.CHAT.BUTTONS.SETTINGS.addEventListener('click', () => {
    tokenedRequest(URLS.CHAT.ME).then( response => {
        UI.SETTINGS.FORM.elements.newName.value = response.name;
    });

    POPUPS.SETTINGS.open();
});

UI.CHAT.BUTTONS.EXIT.addEventListener('click', () => {
    COOKS.TOKEN.clear();
    POPUPS.AUTH.open();
});

UI.AUTH.EXIT.addEventListener('click', () => POPUPS.AUTH.close() );

UI.CONFIRM.EXIT.addEventListener('click', () => POPUPS.AUTH.open() );

UI.SETTINGS.EXIT.addEventListener('click', () => POPUPS.CHAT.open() );

UI.AUTH.FORM.addEventListener('submit', formHandler( () => {
    request(URLS.CHAT.USER, { 
        method: 'post', 
        body: { 
            email: UI.AUTH.FORM.elements.mail.value 
        }
    }).then( () => POPUPS.CONFIRM.open() );
}));

UI.CONFIRM.FORM.addEventListener('submit',formHandler( event => {
    COOKS.TOKEN.set(event.target.elements.code.value);

    tokenedRequest(URLS.CHAT.ME).then( response => { POPUPS.CHAT.open() });
}));

UI.SETTINGS.FORM.addEventListener('submit', formHandler( event => {
    tokenedRequest(URLS.CHAT.USER, 'patch', { 
        name: event.target.elements.newName.value 
    }).then( () => POPUPS.CHAT.open() );
}));

UI.CHAT.FORM.addEventListener('submit', formHandler(event => {
    chatSocket.socket?.send(JSON.stringify({ text: event.target.newMessage.value }));
}))

UI.CHAT.NODE.addEventListener('open', async () => {
    tokenedRequest(URLS.CHAT.ME).then( response => COOKS.MAIL.set(response.email, AGE.DAY) );
    
    try {
        (await tokenedRequest(URLS.CHAT.MESSAGES))?.messages.slice(-50).forEach( createMessage );
    } catch (e) { console.error(e); }

    chatSocket.open(URLS.CHAT.SOCKET + COOKS.TOKEN.get());
});

UI.CHAT.NODE.addEventListener('close', () => {
    chatSocket.close();
    message.clear()
 });

window.addEventListener('unload', () => chatSocket.close() );

tokenedRequest(URLS.CHAT.ME).then( response => { 
    if(response.name) {
        POPUPS.CHAT.open();
        return;
    }
 
    const mail = COOKS.MAIL.get();

    if(!mail) return;

    const auth = UI.AUTH.FORM;

    auth.elements.mail.value = mail;
    auth.querySelector('[type="submit"]').click();            
});