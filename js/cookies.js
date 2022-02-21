export class Cookie {
    constructor(key, value, age = 3600) {
        this.key = key;
        this.value = value;
        this.age = age;
    }
    
    get() {
        try {
            return decodeURIComponent(document.cookie.split('; ').find( cook => cook.split('=')[0] === this.key).split('=')[1]);
        } catch(err) { 
            console.error(err);
        }
    }

    set(value = '') {
        document.cookie = this.key + '=' + encodeURIComponent(value) + '; max-age=' + this.age;
    }
};