// pages/welcome/welcome.js
const app = getApp();
const {regeneratorRuntime} = global;

import {Session} from '../../lib/page.auth'

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    toIndex: function () {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    async onLoad(format, data) {
        var session = Session.get();
        if (session) {
            wx.reLaunch({url: '../index/index'});
        }
        // if (app.globalData.userInfo) {
        //     this.setData({
        //         userInfo: app.globalData.userInfo,
        //         hasUserInfo: true
        //     }, data);
        // } else if (this.data.canIUse) {
        //     app.userInfoReadyCallback = res => {
        //         this.setData({
        //             userInfo: res.userInfo,
        //             hasUserInfo: true
        //         });
        //         Session.set(res);
        //     }
        // } else {
        //     // 在没有 open-type=getUserInfo 版本的兼容处理
        //     wx.getUserInfo({
        //         success: res => {
        //             app.globalData.userInfo = res.userInfo;
        //             this.setData({
        //                 userInfo: res.userInfo,
        //                 hasUserInfo: true
        //             });
        //             Session.set(res);
        //         }
        //     })
        // }
    },
    getUserInfo: function (e) {
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    wx.reLaunch({url: '../index/index'});
                }
            }
        });
        // console.log(e.detail);
        // app.globalData.userInfo = e.detail.userInfo;
        // this.setData({
        //     userInfo: e.detail.userInfo,
        //     hasUserInfo: true
        // });
    }
});
