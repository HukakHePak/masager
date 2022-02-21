import { UI } from './view.js';
import { Cookie } from './cookies.js';
import { request } from './api.js';
import { Message } from './messages.js';
import { popups } from './popups.js';
import { getTime } from './time.js';

const DOMAINS = {
    CHAT: 'https://chat1-341409.oa.r.appspot.com/api/',
};

const URL = {
    CHAT: {
        USER: DOMAINS.CHAT + 'user',
        ME: DOMAINS.CHAT + 'user/me',
        MESSAGES: DOMAINS.CHAT + 'messages',
    },
};

const tokenCook = new Cookie('token');

async function tokenedRequest(url, method, body) {
    return await request(url, { method, body, headers: { Authorization: `Bearer ${ tokenCook.get() }`} });
}

function formHandler(handling) {
    return function(event) {
        event.preventDefault();
        handling(event);
        event.target.reset();
    }
}

UI.CHAT.BUTTONS.SETTINGS.addEventListener('click', async () => {
    UI.SETTINGS.FORM.elements.newName.value = (await tokenedRequest(URL.CHAT.ME)).name;

    popups.open('settings');
});

UI.CHAT.BUTTONS.EXIT.addEventListener('click', () => {
    tokenCook.set();
    popups.open('auth');
});

[ UI.AUTH, UI.CONFIRM ].forEach( item => {
    item.EXIT.addEventListener('click', popups.close);
});

UI.SETTINGS.EXIT.addEventListener('click', () => {
    popups.open('chat');
});

UI.AUTH.FORM.addEventListener('submit', formHandler( async event => {
    const response = await request(URL.CHAT.USER, { 
        method: 'post', 
        body: { 
            email: UI.AUTH.FORM.elements.mail.value 
        }
    });

    if(response) popups.open('confirm'); 
}));

UI.CONFIRM.FORM.addEventListener('submit',formHandler( async event => {
    tokenCook.set(event.target.elements.code.value);

    if(await tokenedRequest(URL.CHAT.ME)) popups.open('chat');
}));

UI.SETTINGS.FORM.addEventListener('submit', formHandler( async event => {
    if(tokenedRequest(URL.CHAT.USER, 'patch', { name: event.target.elements.newName.value })) {
        popups.open('chat');
    }
}));

popups.open(tokenCook.get() ? 'chat' : 'auth');

const messageList = [];

UI.CHAT.FORM.addEventListener('submit', formHandler( event => {
    const message = new Message({ message: event.target.elements.newMessage.value, time: getTime() });
    message.send(tokenedRequest);
    messageList.push(message);
}));

(await tokenedRequest(URL.CHAT.MESSAGES))?.messages?.forEach(({ message, username, createdAt}) => messageList.push(new Message( { 
    message, 
    username, 
    time: getTime(createdAt), 
})));

messageList.forEach(item => item.show());