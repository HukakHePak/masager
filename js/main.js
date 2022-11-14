import { UI } from './view.js';
import { getInfoMe, postMail, TOKEN, changeUserName, getMessages, URLS, updateMessages } from './api.js';
import { Popup } from './popup.js';
import { SocketHandler } from './socket.js';
import { AGE } from './time.js';
import { notify } from './notify.js';
import { chatDisplay } from './chat-display.js';
import { mode } from './dark-mode.js';
import { submitForm, resetFormHandler } from './ui_helpers.js';

const POPUPS = {
    SETTINGS: new Popup(UI.SETTINGS.NODE),
    AUTH: new Popup(UI.AUTH.NODE),
    CHAT: new Popup(UI.CHAT.NODE),
    CONFIRM: new Popup(UI.CONFIRM.NODE),
};

const chatSocket = new SocketHandler( chatDisplay.printMessage );

UI.CHAT.BUTTONS.SETTINGS.addEventListener('click', async () => {
    POPUPS.SETTINGS.open();
    UI.SETTINGS.FORM.elements.newName.value = (await getInfoMe())?.name;  
});

UI.CHAT.BUTTONS.EXIT.addEventListener('click', () => {
    chatSocket.close();
    TOKEN.clear();
    POPUPS.AUTH.open();
});

UI.AUTH.EXIT.addEventListener('click', () => POPUPS.AUTH.close() );//bind

UI.CONFIRM.EXIT.addEventListener('click', () => POPUPS.AUTH.open() );

UI.SETTINGS.EXIT.addEventListener('click', () => POPUPS.CHAT.open() );

UI.AUTH.FORM.addEventListener('submit', resetFormHandler( () => {
    postMail(UI.AUTH.FORM.elements.mail.value);
    POPUPS.CONFIRM.open();
}));

UI.CONFIRM.FORM.addEventListener('submit',resetFormHandler( event => {
    TOKEN.validate(event.target.elements.code.value, validToken => {
        TOKEN.save(validToken, AGE.DAY);
    }).finally(POPUPS.CHAT.open);
}));

UI.SETTINGS.FORM.addEventListener('submit', resetFormHandler( event => { 
    changeUserName(event.target.elements.newName.value);
    POPUPS.CHAT.open()
}));

UI.CHAT.FORM.addEventListener('submit', resetFormHandler(event => {
    chatSocket.send({ 
        text: event.target.newMessage.value 
    });
}));

UI.CHAT.NODE.addEventListener('open', () => {
    updateMessages();
    printHistoryMessages();
    chatSocket.open(URLS.CHAT.SOCKET + TOKEN.get());
});

async function printHistoryMessages() {
    chatDisplay.printMessages(await getMessages(20));
}

chatDisplay.onScrollTop = printHistoryMessages;

UI.CHAT.NODE.addEventListener('close', chatDisplay.clear );
UI.SETTINGS.BUTTONS.LIGHT.addEventListener('click', () => mode.set('light'));
UI.SETTINGS.BUTTONS.DARK.addEventListener('click', () => mode.set('dark'));

window.addEventListener('unload', chatSocket.close );
window.addEventListener('blur', notify.unmute);
window.addEventListener('focus', notify.mute);

window.addEventListener('load', () => {
    mode.set(mode.get());

    getInfoMe().then( info => { 
        if(info.name) {
            POPUPS.CHAT.open();  
            return;
        }

        if(info.email) {
            UI.AUTH.FORM.elements.mail.value = info.email;
            submitForm(UI.AUTH.FORM);  
        }      
    });
    POPUPS.AUTH.open();
});