export class Storage {
    constructor(key, options) {
        this.key = key;
        this.storage =  localStorage;

        if(options?.value) {
            this.default = options.value;
            this.set();
        }
    }

    get() {
        const value = localStorage.getItem(this.key);
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }

    set(value = this.default) {
        this.storage.setItem(this.key, JSON.stringify(value));
    }

    clear() {
        this.set('');
    }

    isEmpty() {
        return !this.get();
    }
}