import { UI } from "./view.js";

export const popups = {
    close() {
        for(let element in UI) {
            UI[element].NODE?.classList.remove('active');
        }
    },
    open(name) {
        this.close();
        UI[name.toUpperCase()]?.NODE?.classList.add('active');
    }
}