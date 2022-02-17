import { UI } from './view.js';

//console.log(UI.MESSAGE.CREATE_FORM)

const messageForm = UI.MESSAGE.CREATE_FORM;

messageForm.addEventListener('submit', event => {
    const msgText = messageForm.elements.newMessage.value;

    if(!msgText) {
        event.preventDefault();
        return;
    }

    const msgNode = UI.MESSAGE.TEMPLATE.content.cloneNode(true);

    msgNode.querySelector('.content').textContent = msgText;

    msgNode.querySelector('.time').textContent = getTime();

    UI.MESSAGE.DISPLAY.append(msgNode);

    messageForm.reset();
    event.preventDefault();
});



function getTime() {
    const date = new Date();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
}

// const request = await fetch('https://chat1-341409.oa.r.appspot.com/api/user', { 
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify({
//         email: 'nikak_ne_rak@mail.ru' 
//     })
// });

// console.log(await request.json());