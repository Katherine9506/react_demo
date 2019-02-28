import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');
const app = getApp();
// pages/mineWallet/mineWallet.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        domain: "https://hgdj-server.oss-cn-hangzhou.aliyuncs.com/",
    },
    //零钱明细
    changeDetail: function () {
        wx.navigateTo({
            url: '/pages/mineChange/mineChange?type=change',
        })
    },
    //提现明细
    withdrawDetail: function () {
        wx.navigateTo({
            url: '/pages/mineChange/mineChange?type=withdraw'
        })
    },
    cashTap: function () {
        wx.navigateTo({
            url: '/pages/mineToCash/mineToCash',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        if (app.globalData.hasUser) {
            this.data.user = app.globalData.user;
        } else {
            let session = Session.get();
            if (session) {
                this.data.userInfo = JSON.parse(session.userInfo);
                let user = await $request({
                    url: api.user_info,
                    method: 'GET',
                    data: {openid: this.data.userInfo.openId}
                });
                this.data.user = JSON.parse(user.data);
            }
        }
        this.setData({user: this.data.user});
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    async onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        console.log(this.data.user);
        var res = await $request({
            url: api.user_info,
            data: {openid: this.data.user.openid},
            method: 'GET'
        });
        this.data.user = JSON.parse(res.data);
        this.setData({
            user: this.data.user,
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})