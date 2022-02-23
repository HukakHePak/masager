export const AGE = {
    DAY: 3600 * 24,
    HOUR: 3600,
}

export class Cookie {
    constructor(key, value, age) {
        this.key = key;
        
        if(value) this.set(value, age);
    }
    
    get() {
        try {
            return decodeURIComponent(document.cookie.split('; ').find( cook => cook.split('=')[0] === this.key).split('=')[1]);
        } catch(err) { 
            console.error(err);
            return '';
        }
    }

    set(value = '', age = AGE.HOUR) {
        document.cookie = this.key + '=' + encodeURIComponent(value) + '; max-age=' + age;
    }

    clear() {
        this.set();
    }
};
