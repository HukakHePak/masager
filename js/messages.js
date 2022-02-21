import { UI } from "./view.js";

export const message = {
    send({ content, time }) {   
        const msgNode = UI.CHAT.TEMPLATE.content.cloneNode(true);
    
        msgNode.querySelector('.content').textContent = content;
        msgNode.querySelector('.time').textContent = time;

        UI.CHAT.DISPLAY.prepend(msgNode);
    },
    clear() {
        const list = UI.CHAT.DISPLAY.children;

        while(list.length) {
            list[0].remove();
        }
    }
};

export class Message {
    constructor( { message, time, username }) {
        this.node = UI.CHAT.TEMPLATE.content.cloneNode(true);

        this.ui = {
            time: this.node.querySelector('.time'),
            content: this.node.querySelector('.content'),
            sender: this.node.querySelector('.sender'),
            node: this.node.querySelector('.message__deck')
        };

        this.ui.time.textContent = time;   
        this.edit(message?.trim());

        if(username) this.ui.sender.textContent = username;
        else this.ui.node.classList.add('me');
    }

    show() {
        UI.CHAT.DISPLAY.prepend(this.node);
    }

    hide() {
        this.ui.node.remove();
    }

    get() {
        return this.ui.content.textContent;
    }

    edit(content) {
        this.ui.content.textContent = content;
    }

    read() {
        this.node.classList.remove('unread');
    }

    send(request) {
        if(!this.get()) return;

        this.show();
    }
}