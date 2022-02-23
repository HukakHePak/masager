const DOMAINS = {
    CHAT: 'https://chat1-341409.oa.r.appspot.com/api/',
};

export const URLS = {
    CHAT: {
        USER: DOMAINS.CHAT + 'user',
        ME: DOMAINS.CHAT + 'user/me',
        MESSAGES: DOMAINS.CHAT + 'messages',
        SOCKET: 'wss://chat1-341409.oa.r.appspot.com/websockets?'
    },
};

export async function request(url, options = {}) {
    options.method = options?.method?.toUpperCase();

    if(!options.headers) options.headers = {};
    
    options.headers['Content-Type'] = 'application/json;charset=utf-8';

    if(options.body) {
        options.body = JSON.stringify(options.body);
    }

    return fetch(url, options).then(response => response.json()).catch(console.error);
}