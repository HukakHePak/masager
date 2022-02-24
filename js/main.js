import { UI } from './view.js';
import { Cookie, AGE } from './cookie.js';
import { request, URLS } from './api.js';
import { message } from './messages.js';
import { Popup } from './popup.js';
import { SocketHandler } from './socket.js';

const POPUPS = {
    SETTINGS: new Popup(UI.SETTINGS.NODE),
    AUTH: new Popup(UI.AUTH.NODE),
    CHAT: new Popup(UI.CHAT.NODE),
    CONFIRM: new Popup(UI.CONFIRM.NODE),
};

const COOKS = {
    TOKEN: new Cookie('token'),
};

const chatSocket = new SocketHandler( event => { 
    const data = JSON.parse(event.data);

    message.print(data);

    if(localStorage.getItem('mail') != data.user.email) UI.CHAT.SOUND.play();
 } );

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
    chatSocket.close();
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
    COOKS.TOKEN.set(event.target.elements.code.value, AGE.HOUR * 3);

    tokenedRequest(URLS.CHAT.ME).then( () => { POPUPS.CHAT.open() });
}));

UI.SETTINGS.FORM.addEventListener('submit', formHandler( event => {
    tokenedRequest(URLS.CHAT.USER, 'patch', { 
        name: event.target.elements.newName.value 
    });

    POPUPS.CHAT.open()
}));

UI.CHAT.FORM.addEventListener('submit', formHandler(event => {
    chatSocket.socket?.send(JSON.stringify({ text: event.target.newMessage.value }));
}))

UI.CHAT.NODE.addEventListener('open', async () => {    // добавить функции прокрутки и догрузки
    (await tokenedRequest(URLS.CHAT.MESSAGES))?.messages.slice(-50).forEach( message.print );
  
    chatSocket.open(URLS.CHAT.SOCKET + COOKS.TOKEN.get());
});

UI.CHAT.NODE.addEventListener('close', () => {
    message.clear()
});

window.addEventListener('unload', () => chatSocket.close() );

tokenedRequest(URLS.CHAT.ME).then( response => { 
    if(response.name) {
        POPUPS.CHAT.open();
        localStorage.setItem('mail', response.email);
        return;
    }

    UI.AUTH.FORM.elements.mail.value = response.email;
    UI.AUTH.FORM.querySelector('[type="submit"]').click();            
});