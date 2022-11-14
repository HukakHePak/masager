import { UI } from "./view.js";
import { formatDate } from './time.js';
import { setActive, isActive } from "./ui_helpers.js";
import { notify } from './notify.js';
import { storages } from "./api.js";

const display = UI.CHAT.DISPLAY;

export const chatDisplay = { 
    printMessages(messages) {        
        if(!messages.length) {
            chatDisplay.printEnd();
            return;
        }

        messages.forEach( message => display.append(chatDisplay.createMessage(message)) );
    },

    async printEnd() { 
        const story = UI.CHAT.STORY; 

        if(isActive(story)) return;

        setActive(story, true);
        display.append(story);
    },

    printMessage(event) {
        const data = typeof event.data == 'string' ? JSON.parse(event.data) : event.data;
    
        if(storages.email.get() != data.user.email) notify.sound(); 

        const height = display.scrollHeight;
        
        display.prepend(chatDisplay.createMessage(data));

        if(-display.scrollTop <= display.clientHeight) {
            display.scrollTop = height - display.scrollHeight;
            chatDisplay.scrollDown();
        }
        
    },

    createMessage(data) {
        try {   
            const node = UI.CHAT.TEMPLATE.content.cloneNode(true);

            const sender = node.querySelector('.sender');

            if(storages.email.get() == data.user.email) {
                data.user.name = 'Вы';
                node.querySelector('.message__deck').classList.add('me');
            } else  {
                sender.addEventListener('click', () => {
                    UI.CHAT.FORM.elements.newMessage.value = '@'+ data.user.name + ' ';
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
            setTimeout(chatDisplay.scrollDown, 0);
        }        
    },

    onScrollTop() { },
};


UI.CHAT.BUTTONS.SCROLL.addEventListener('click', chatDisplay.scrollDown );

UI.CHAT.DISPLAY.addEventListener('scroll', async () => {
    const height = display.clientHeight;
    const scroll = display.scrollTop;
    const length = display.scrollHeight;

    if(-scroll > length - height * 2) chatDisplay.onScrollTop(); 
    

    setActive(UI.CHAT.BUTTONS.SCROLL, (-scroll > height / 2));
});
