export function formatDate(iso) {
    const date = iso ? new Date(iso) : new Date();

    return {
        date: toXX(date.getDate) + ' ' + toXX(date.getMonth) + ' ' + date.getFullYear(),
        time: toXX(date.getHours()) + ':' + toXX(date.getMinutes())
    }
}

function toXX(time) {
    return (time < 10 ? '0' : '') + time;
}