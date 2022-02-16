import { UI } from './view.js';

//console.log(UI.MESSAGE.CREATE_FORM)

const messageForm = UI.MESSAGE.CREATE_FORM;

messageForm.addEventListener('submit', event => {
    const msgText = messageForm.elements.newMessage.value;
    const msgNode = UI.MESSAGE.TEMPLATE.content.cloneNode(true);

    msgNode.querySelector('.content').textContent = msgText;

    const date = new Date();

    msgNode.querySelector('.time').textContent = date.getHours() + ':' + date.getMinutes();

    UI.MESSAGE.DISPLAY.append(msgNode);

    messageForm.reset();
    event.preventDefault();
});