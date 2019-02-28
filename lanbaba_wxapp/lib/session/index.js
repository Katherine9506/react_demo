import constants from './constants'
import errors from './errors'
import Session from './session'
import loginLib from './login'
import requestLib from './request'
import promisifyLib from './promisify'

const exports = {
    Session,
    ...errors,
    ...loginLib,
    ...requestLib,
    ...promisifyLib
};

/* 导出错误类型码 */
Object.keys(constants).forEach(key => {
    if (key.indexOf('ERR_') === 0) {
        exports[key] = constants[key];
    }
});

module.exports = exports;