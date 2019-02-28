import constants from './constants'

const SESSION_KEY = `wxapp_session_${constants.WX_SESSION_MAGIC_ID}`;

/* 本地storage中session存取删除操作 */
const Session = {
    get: () => {
        return wx.getStorageSync(SESSION_KEY) || null;
    },
    set: session => {
        wx.setStorageSync(SESSION_KEY, session);
    },
    clear: () => {
        /* 从本地缓存中移除session 同步版本 */
        wx.removeStorageSync(SESSION_KEY);
    }
};

module.exports = Session;