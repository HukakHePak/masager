export function getTime() {
    const date = new Date();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
}