import { UI } from './view.js';
import { Cookie } from './cookie.js';
import { request, URLS } from './api.js';
import { AGE } from './time.js';
import { message } from './messages.js';
import { Popup } from './popup.js';
import { SocketHandler } from './socket.js';

const POPUPS = {
    SETTINGS: new Popup(UI.SETTINGS.NODE),
    AUTH: new Popup(UI.AUTH.NODE),
    CHAT: new Popup(UI.CHAT.NODE),
    CONFIRM: new Popup(UI.CONFIRM.NODE),
};

const MESSAGES__CHUNK__SIZE = 20;

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

UI.SETTINGS.FORM.addEventListener('submit', formHandler( event => { // remake submits to one handle
    tokenedRequest(URLS.CHAT.USER, 'patch', { 
        name: event.target.elements.newName.value 
    });

    POPUPS.CHAT.open()
}));

UI.CHAT.FORM.addEventListener('submit', formHandler(event => {
    chatSocket.socket?.send(JSON.stringify({ text: event.target.newMessage.value }));
    message.scrollDown();
}));

UI.CHAT.NODE.addEventListener('open', async () => {
    const { messages } = (await tokenedRequest(URLS.CHAT.MESSAGES));

    if(!messages) return;

    localStorage.setItem('messages', JSON.stringify(messages));

    message.printChunk(MESSAGES__CHUNK__SIZE);
  
    chatSocket.open(URLS.CHAT.SOCKET + COOKS.TOKEN.get());
});

UI.CHAT.BUTTONS.SCROLL.addEventListener('click', message.scrollDown );

UI.CHAT.DISPLAY.addEventListener('scroll', () => {
    const display = UI.CHAT.DISPLAY;

    if(-display.scrollTop > (display.scrollHeight - display.clientHeight * 2)) {
        message.printChunk(MESSAGES__CHUNK__SIZE);
    }

    UI[(-display.scrollTop > display.clientHeight / 2 ? '' : 'de') + 'active'](UI.CHAT.BUTTONS.SCROLL);
});

UI.CHAT.NODE.addEventListener('close', message.clear );

window.addEventListener('unload', chatSocket.close );

UI.SETTINGS.BUTTONS.LIGHT.addEventListener('click', () => {
    UI.HTML.classList.remove('dark');
    UI.deactive(UI.VIDEO);
    
    localStorage.setItem('mode', '');
});

UI.SETTINGS.BUTTONS.DARK.addEventListener('click', () => {
    UI.HTML.classList.add('dark');
    UI.active(UI.VIDEO);

    localStorage.setItem('mode', 'dark');
});

if(localStorage.getItem('mode')) UI.SETTINGS.BUTTONS.DARK.click();

tokenedRequest(URLS.CHAT.ME).then( response => { 
    if(response.name) {
        POPUPS.CHAT.open();
        localStorage.setItem('mail', response.email);
        return;
    }

    UI.AUTH.FORM.elements.mail.value = localStorage.getItem('mail');
    UI.AUTH.FORM.querySelector('[type="submit"]').click();            
});

if(COOKS.TOKEN.get()) {
    setInterval( () => {
        if(!COOKS.TOKEN.get()) {
            UI.CHAT.BUTTONS.EXIT.click();
        }
    }, AGE.MINUTE * 5 * 1000);
}

window.addEventListener('blur', () => UI.CHAT.SOUND.volume = 1 );
window.addEventListener('focus', () => UI.CHAT.SOUND.volume = 0 );