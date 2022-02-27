import { UI } from "./view.js";
import { formatDate } from './time.js';

const display = UI.CHAT.DISPLAY;

export const message = { 
    printChunk(size) {
        const messages = JSON.parse(localStorage.getItem('messages'));  
        
        if(!messages.length) {
            message.printEnd();
            return;
        }

        if(messages.length < size) {
            size = messages.length;
        }
        
        for(let i = 0; i < size; i++) {
            display.append(message.create(messages.pop()));
        } 
        
        localStorage.setItem('messages', JSON.stringify(messages));
    },

    async printEnd() {
        const story = UI.CHAT.STORY; 

        if(UI.isActive(story)) return;

        UI.active(story);
        display.append(story);
    },

    print(data) {
        const height = display.scrollHeight;
        
        display.prepend(message.create(data));

        if(-display.scrollTop <= display.clientHeight) {
            display.scrollTop = height - display.scrollHeight;
            message.scrollDown();
        }
        
    },

    create(data) {
        try {   
            const node = UI.CHAT.TEMPLATE.content.cloneNode(true);

            const sender = node.querySelector('.sender');

            if(localStorage.getItem('mail') == data.user.email) {
                data.user.name = 'Вы';
                node.querySelector('.message__deck').classList.add('me');
            } else  {
                sender.addEventListener('click', () => {
                    UI.CHAT.FORM.elements.newMessage.value = '@'+ data.user.name;
                });
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
    },

    scrollDown() {
        display.scrollTop -= (display.scrollTop - 40) / 40;

        if(-display.scrollTop > 0) {
            setTimeout(message.scrollDown, 0);
        } 
    },
};