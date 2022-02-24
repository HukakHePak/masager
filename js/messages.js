import { UI } from "./view.js";
import { formatDate } from './time.js';

const display = UI.CHAT.DISPLAY;

export const message = {
    printChunk(size) {
        const messages = JSON.parse(localStorage.getItem('messages'));
        
        const story = UI.CHAT.STORY;            

        if(messages.length < size) {
            size = messages.length;
            story.classList.add('active');
        }
        
        for(let i = 0; i < size; i++) {
            display.append(message.create(messages.pop()));
        }

        if(story.classList.contains('active')) display.append(story);
        
        localStorage.setItem('messages', JSON.stringify(messages));
    },

    print(data) {   
        const node = message.create(data);
        display.prepend(node);
        if(-display.scrollTop < display.clientHeight) display.scrollTop = 0;
    },

    create(data) {
        try {   
            const node = UI.CHAT.TEMPLATE.content.cloneNode(true);

            if(localStorage.getItem('mail') == data.user.email) {
                data.user.name = 'Вы';
                node.querySelector('.message__deck').classList.add('me');
            }
    
            node.querySelector('.content').textContent = data.text;
            node.querySelector('.time').textContent = formatDate(data.createdAt).time;
            node.querySelector('.sender').textContent = data.user.name;       

            return node;
        } catch (e) {
            e.message = 'uncorrect data'
            console.error(e);
        }
    },

    clear() {
        display.innerHTML = '';
    }
};