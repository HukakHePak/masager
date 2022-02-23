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

    set(value = '', age = 3600) {
        document.cookie = this.key + '=' + encodeURIComponent(value) + '; max-age=' + age;
    }

    clear() {
        this.set();
    }
};