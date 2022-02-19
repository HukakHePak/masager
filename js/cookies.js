export const cookie = {
    saveToken(token = '') {
        document.cookie = 'token=' + encodeURIComponent(token) + '; max-age = 3600';
    },
    getToken() {
        try {
            return decodeURIComponent(document.cookie.split('; ').find( cook => cook.split('=')[0] === 'token').split('=')[1]);
        } catch { }
    },
};