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

/** * 时间秒数格式化 * @param s 秒数 * @returns {*} 格式化后的时分秒 */
var sec_to_time = function (s) {
    var t;
    if (s > -1) {
        var hour = Math.floor(s / 3600);
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        if (hour < 10) {
            t = '0' + hour + ":";
        } else {
            t = hour + ":";
        }

        if (min < 10) {
            t += "0";
        }
        t += min + ":";
        if (sec < 10) {
            t += "0";
        }
        t += sec.toFixed(0);
    }
    return t;
};

module.exports = {
    formatTime: formatTime,
    checkPhone: checkPhone,
    getTodayDate: getTodayDate,
    trim: trim,
    sec_to_time: sec_to_time
};
