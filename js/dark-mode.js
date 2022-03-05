import { UI } from "./view.js";
import { Storage } from "./storage.js";
import { setActive } from "./ui_helpers.js";

const modeStorage = new Storage('mode');

export const mode = {
    set(color) {
        switch (color) {
            case 'light':
                UI.HTML.classList.remove('dark');
                setActive(UI.VIDEO, false);
            break;
            case 'dark':
                UI.HTML.classList.add('dark');
                setActive(UI.VIDEO, true);
            break;
        }

        localStorage.setItem('mode', color);
    },
    get() {
        return modeStorage.get();
    }
}