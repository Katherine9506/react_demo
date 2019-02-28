const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
};

const checkPhone = phone => {
    if ((phone = trim(phone)) == '' || !(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
        return false;
    }
    return true;
};

const trim = str => {
    return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
};

const getTodayDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join('-')
};

module.exports = {
    formatTime: formatTime,
    checkPhone: checkPhone,
    getTodayDate: getTodayDate,
    trim: trim,
};
