/* 请求过程中发生的异常 */
class RequestError extends Error {
    constructor(type, message) {
        super(message);
        this.type = type;
        this.message = message;
    }
}

/* 登录异常 */
class LoginError extends Error {
    constructor(type, message) {
        super(message);
        this.type = type;
        this.message = message;
    }
}

module.exports = {RequestError, LoginError};