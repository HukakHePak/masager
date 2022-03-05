import { UI } from './view.js';

const audio = UI.CHAT.SOUND;

export const notify = {
    mute() {
        audio.volume = 1;
    },
    unmute() {
        audio.volume = 0;
    },
    sound() {
        audio.play();
    }
}