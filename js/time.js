export const AGE = {
    DAY: 3600 * 24,
    HOUR: 3600,
    MINUTE: 60,
    SECOND: 1,
    WEEK: 3600 * 24 * 7
}

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