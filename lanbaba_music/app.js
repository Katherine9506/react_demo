//app.js

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('./lib/regenerator/runtime-module');

let api = require('/utils/api');
import {setLoginUrl} from './lib/page.auth'

App({
    globalData: {
        userInfo: null,//{avatarUrl,city,country,gender,language,nickName,province}
        hasUserInfo: false,
        /* 播放歌曲时 循环列表 */
        audioCycles: [],
        todayMemberCheck: false,//当日检查会员状态
        memberCheckDate: null,//会员状态检查日期
    },
    onLaunch: function () {
        /* 设置登录URL */
        setLoginUrl(api.login);

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        });
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo;

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
});