import { UI } from "./view.js";
import { formatDate } from './time.js';

export const message = {
    print(data) {   
        try {   
            const node = UI.CHAT.TEMPLATE.content.cloneNode(true);

            if(localStorage.getItem('mail') == data.user.email) {
                data.user.name = 'Вы';
                node.querySelector('.message__deck').classList.add('me');
            }
    
            node.querySelector('.content').textContent = data.text;
            node.querySelector('.time').textContent = formatDate(data.createdAt).time;
            node.querySelector('.sender').textContent = data.user.name;       

            UI.CHAT.DISPLAY.prepend(node);
        } catch (e) {
            e.message = 'uncorrect data'
            console.error(e);
        }
    },

    clear() {
        UI.CHAT.DISPLAY.innerHTML = '';
    }
};