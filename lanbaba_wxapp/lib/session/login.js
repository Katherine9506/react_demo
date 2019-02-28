import constants from './constants'
import Session from './session'
import {LoginError} from './errors'
import {promisify} from './promisify'

const wxLogin = promisify(wx.login);
const wxGetUserInfo = promisify(wx.getUserInfo);
const wxRequest = promisify(wx.request);
const defaultOptions = {
    method: 'GET',
    loginUrl: null
};

/* 设置登录URL */
const setLoginUrl = loginUrl => {
    defaultOptions.loginUrl = loginUrl;
};

/* 微信登录，获取登录凭证code和加密用户数据encryptedData */
const getWxLoginResult = () => {
    return wxLogin().then(loginResult => wxGetUserInfo({lang: 'zh_CN'}).then(userResult => ({
        code: loginResult.code,
        encryptedData: userResult.encryptedData,
        iv: userResult.iv
    }))).catch(err => {
        console.log(err);
        const errMsg = err.errMsg || '';
        let error = null;
        if (errMsg.indexOf('login:fail') === 0) {
            error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
        } else {
            error = new LoginError(consts.ERR_WX_GET_USER_INFO, '获取微信用户信息失败，请检查网络状态')
        }
        error.detail = err;
        return Promise.reject(error);
    });
};

/* 通过登录凭证code进行登录 */
const loginWithCode = options => {
    options = {...defaultOptions, ...options};
    if (!defaultOptions.loginUrl) {
        return Promise.reject(new LoginError(consts.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'));
    }
    return wxLogin().then(loginResult => wxRequest({
        method: options.method,
        url: options.loginUrl,
        header: {
            'Accept': 'application/json',
            [constants.WX_HEADER_FLAG]: 1,
            [constants.WX_HEADER_CODE]: loginResult.code
        }
    })).catch(() => {
        return Promise.reject(new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常'));
    }).then(result => {
        const data = result.data;
        if (!data || data.code !== 0 || !data.data || !data.data.skey) {
            return Promise.reject(new LoginError(constants.ERR_LOGIN_FAILED, '用户还未进行过授权登录，请先使用 login() 登录'));
        }
        const res = data.data;
        if (!res || !res.userInfo) {
            return Promise.reject(new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, `登录失败(${data.error})：${data.message}`));
        }
        Session.set(res);
        return res.userInfo;
    });
};

/* 服务器登录 */
const login = options => {
    options = {...defaultOptions, ...options};
    if (!defaultOptions.loginUrl) {
        return Promise.reject(new LoginError(constants.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'));
    }
    return getWxLoginResult().then(loginResult => wxRequest({
        method: options.method,
        url: options.loginUrl,
        header: {
            'Accept': 'application/json',
            [constants.WX_HEADER_FLAG]: 1,
            [constants.WX_HEADER_CODE]: loginResult.code,
            [constants.WX_HEADER_ENCRYPTED_DATA]: loginResult.encryptedData,
            [constants.WX_HEADER_IV]: loginResult.iv
        }
    })).catch(() => {
        return Promise.reject(new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常'));
    }).then(result => {
        const data = result.data;
        if (!data || !data.data || !data.data.status || !data.data.loginStatus || !data.data.loginStatus.skey) {
            return Promise.reject(new LoginError(constants.ERR_LOGIN_FAILED, `响应错误，${JSON.stringify(data)}`));
        }
        const res = data.data.loginStatus;
        if (!res || !res.userInfo) {
            return Promise.reject(new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, `登录失败[${data.error}] ${data.message}`));
        }
        Session.set(res);
        return res.userInfo;
    })
};

module.exports = {setLoginUrl, loginWithCode, login};