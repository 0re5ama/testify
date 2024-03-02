export const formatDate = (val) => {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};

export const formatDateTime = (val) => {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const min = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} @${hour}:${min}`;
};

/**
 * Adds specific days / months / years to a date
 * @constructor
 * @param {string} interval - The interval to add in the format: {num}{span},
 * where num is a number which can be negative.
 * span is a timespan which can take the following
 * d - days
 * m - months
 * y - years
 * @param {date} date - The date. If not passed, it takes current date instead.
 */
export const addDate = (interval, date = null) => {
    if (!interval) throw 'Specify the format';
    const adder = interval.match(/^(-?\d+)(d|m|y)$/);
    const [_, num, span] = adder;
    if (!date) date = new Date();
    let res = new Date(date);
    switch (span) {
        case 'd':
            res.setDate(date.getDate() + +num);
            break;
        case 'm':
            res.setMonth(date.getMonth() + +num);
            break;
        case 'y':
            res.setFullYear(date.getFullYear() + +num);
            break;
        default:
            throw 'invalid interval';
    }
    return res;
};
