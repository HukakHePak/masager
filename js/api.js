import { Storage } from './storage.js';
import { Cookie } from './cookie.js';

const DOMAINS = {
    CHAT: 'https://note-lawn.ru/masager/api/',
};

export const URLS = {
    CHAT: {
        USER: DOMAINS.CHAT + 'user',
        ME: DOMAINS.CHAT + 'user/me',
        MESSAGES: DOMAINS.CHAT + 'messages',
        SOCKET: 'wss://note-lawn.ru/masager/websocket?'
    },
};

export const storages = {
    token: new Cookie('token'),
    email: new Storage('email'),
    messages: new Storage('messages'),
};

export const TOKEN = {
    save(token, time) {
        storages.token.set(token, time);
    },
    
    get() {
        return storages.token.get();
    },
    
    async isValid(token) {
        return !!(await tokenedRequest(URLS.CHAT.ME, 'get', undefined, token))?.name;
    },

    clear() {
        storages.token.clear();
    },

    async validate(token, onValid, onInvalid) {
        if(await TOKEN.isValid(token)) onValid(token);
        else onInvalid(token);
    }
};

export async function request(url, options = {}) {
    options.method = options.method?.toUpperCase();

    if(!options.headers) options.headers = {};
    
    options.headers['Content-Type'] = 'application/json;charset=utf-8';

    if(options.body) {
        options.body = JSON.stringify(options.body);
    }

    return fetch(url, options)
        .then(response => response.json())
        .catch(console.error);
}


function tokenedRequest(url, method, body, token = TOKEN.get()) {
    return request(url, { 
        method, 
        body, 
        headers: { 
            Authorization: `Bearer ${ token }`
        } 
    });
}

export function postMail(value) {
    request(URLS.CHAT.USER, {
        method: 'post', 
        body: { 
            email: value 
        }
    }).then( () => storages.email.set(value));
}

export function changeUserName(name) {
    tokenedRequest(URLS.CHAT.USER, 'patch', { name });
}

export async function getInfoMe() {
    const info = await tokenedRequest(URLS.CHAT.ME) || {};
    
    if(!info?.email) info.email = storages.email.get();

    return info;
}

export async function updateMessages() {
    storages.messages.clear();
}

export async function getMessages(count) {
    let messages = storages.messages.get();

    if(!messages) messages = (await tokenedRequest(URLS.CHAT.MESSAGES))?.messages;
                        
    storages.messages.set(messages.slice(0, -count));

    return messages.slice(-count).reverse();
}