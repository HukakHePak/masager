import { UI } from './view.js';
import { Cookie } from './cookies.js';
import { request } from './api.js';
import { message } from './messages.js';
import { Popup } from './popups.js';
import { formatDate } from './time.js';
import { SocketHandler } from './socket.js';

const DOMAINS = {
    CHAT: 'https://chat1-341409.oa.r.appspot.com/api/',
};

const URL = {
    CHAT: {
        USER: DOMAINS.CHAT + 'user',
        ME: DOMAINS.CHAT + 'user/me',
        MESSAGES: DOMAINS.CHAT + 'messages',
        SOCKET: 'ws://chat1-341409.oa.r.appspot.com/websockets?'
    },
};

const POPUPS = {
    SETTINGS: new Popup(UI.SETTINGS.NODE),
    AUTH: new Popup(UI.AUTH.NODE),
    CHAT: new Popup(UI.CHAT.NODE),
    CONFIRM: new Popup(UI.CONFIRM.NODE),
}

const tokenCook = new Cookie('token');

const chatSocket = new SocketHandler(async event => {
    const data = JSON.parse(event.data);

    console.log(data);
    
    const user = (await tokenedRequest(URL.CHAT.ME)).email == data.user.email ? undefined : data.user.name;

    message.print(data.text, formatDate(data.createdAt), user);
});

function tokenedRequest(url, method, body) {
    return request(url, { method, body, headers: { Authorization: `Bearer ${ tokenCook.get() }`} });
}

function formHandler(handling) {
    return event => {
        event.preventDefault();
        handling(event);
        event.target.reset();
    }
}

UI.CHAT.BUTTONS.SETTINGS.addEventListener('click', () => {
    tokenedRequest(URL.CHAT.ME).then( response => {
        UI.SETTINGS.FORM.elements.newName.value = response.name;
    });

    POPUPS.SETTINGS.open();
});

UI.CHAT.BUTTONS.EXIT.addEventListener('click', () => {
    tokenCook.clear();
    POPUPS.AUTH.open();
});

UI.AUTH.EXIT.addEventListener('click', () => POPUPS.AUTH.close() );

UI.CONFIRM.EXIT.addEventListener('click', () => POPUPS.CONFIRM.close() );

UI.SETTINGS.EXIT.addEventListener('click', () => POPUPS.CHAT.open() );

UI.AUTH.FORM.addEventListener('submit', formHandler( event => {
    request(URL.CHAT.USER, { 
        method: 'post', 
        body: { 
            email: UI.AUTH.FORM.elements.mail.value 
        }
    }).then( () => POPUPS.CONFIRM.open() );
}));

UI.CONFIRM.FORM.addEventListener('submit',formHandler( event => {
    tokenCook.set(event.target.elements.code.value);

    tokenedRequest(URL.CHAT.ME).then( () => POPUPS.CHAT.open() );
}));

UI.SETTINGS.FORM.addEventListener('submit', formHandler( event => {
    tokenedRequest(URL.CHAT.USER, 'patch', { 
        name: event.target.elements.newName.value 
    }).then( () => POPUPS.CHAT.open() );
}));

UI.CHAT.FORM.addEventListener('submit', formHandler(event => {
    chatSocket.socket?.send(JSON.stringify({ text: event.target.newMessage.value }));
}))

UI.CHAT.NODE.addEventListener('open', () => {
    console.log('opened');
    chatSocket.open(URL.CHAT.SOCKET + tokenCook.get());
});

UI.CHAT.NODE.addEventListener('close', () => {
    chatSocket.close();
});

window.addEventListener('unload', () => chatSocket.close() );

POPUPS[tokenCook.get() ? 'CHAT' : 'AUTH'].open();

//TODO: fix getting mesages while settings open