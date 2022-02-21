import { UI } from "./view.js";
import { getTime } from "./time.js";

export const message = {
    send(message) {   
        const msgNode = UI.CHAT.TEMPLATE.content.cloneNode(true);
    
        msgNode.querySelector('.content').textContent = message.content;
        msgNode.querySelector('.time').textContent = getTime();
    
        UI.CHAT.DISPLAY.prepend(msgNode);
    },
    clear() {
        const list = UI.CHAT.DISPLAY.children;

        while(list.length) {
            list[0].remove();
        }
    }
};