import { UI } from "./view.js";

export const message = {
    print(text, date, user) {   
        const msgNode = UI.CHAT.TEMPLATE.content.cloneNode(true);
    
        msgNode.querySelector('.content').textContent = text;
        msgNode.querySelector('.time').textContent = date.time;
        msgNode.querySelector('.sender').textContent = user || 'Вы';

        if(!user) msgNode.querySelector('.message__deck').classList.add('me');

        UI.CHAT.DISPLAY.prepend(msgNode);
    },
    clear() {
        UI.CHAT.DISPLAY.innerHTML = '';
    }
};