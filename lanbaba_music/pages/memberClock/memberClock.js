// pages/memberClock/memberClock.js
import {$digest, $init} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module');
const app = getApp();
let api = require('../../utils/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {},
    /* 检查用户是否非连续签到 */
    async checkUserSign() {
        var res = await $request({
            url: api.user_check_sign,
            data: {uuid: app.globalData.userInfo.id}
        });
        console.log(res);
        return res.data;
    },
    /* 获取用户连续签到天数 & 是否已享受免费会员 */
    async freeMemberCheck() {
        var res = await $request({
            url: api.user_free_member_check,
            data: {uuid: app.globalData.userInfo.id}
        });
        console.log(res);
        return res;
    },
    /* 用户签到操作 */
    async signEventHandler(e) {
        if (app.globalData.userInfo.hasOwnProperty('sign_member')) {
            if (app.globalData.userInfo.sign_member) {
                this.showModal('您已享受过签到会员!');
                this.setData({sign_member: true});
                return false;
            }
        } else {
            var res = await this.freeMemberCheck();
            if (res.data.member) {
                this.showModal('您已享受过签到会员!');
                this.setData({sign_member: res.data.member});
                app.globalData.userInfo['sign_member'] = res.data.member;
                return false;
            }
        }
        /* 检查是否连续签到 */
        var signStatus = await this.checkUserSign();
        if (signStatus.status == 3) {
            this.showModal('非连续签到。将清空历史记录并重新签到!');
        }
        var res = await $request({
            url: api.user_sign,
            data: {uuid: app.globalData.userInfo.id, signStatus: signStatus.status}
        });
        console.log(res);
        if (res.code == 204) {
            this.showModal(res.msg);
            return false;
        }
        this.setData({
            signDays: res.data.signDays,
            hasSignToday: true
        });
        app.globalData.userInfo['sign_member'] = res.data.member;
        if (res.data.hasOwnProperty('member') && res.data.member) {
            this.showModal(`签到成功！享受免费会员${res.data.freeDays}天。`);
            this.setData({sign_member: res.data.member});
            app.globalData.userInfo['sign_member'] = 1;
            app.globalData.userInfo['is_member'] = 1;
            app.globalData.userInfo['expire_date'] = res.data.expire_date;
            var session = Session.get();
            session.userInfo['sign_member'] = 1;
            session.userInfo['is_member'] = 1;
            session.userInfo['expire_date'] = res.data.expire_date;
            Session.set(session);
            console.log(app.globalData.userInfo);
        } else {
            this.showModal(res.data.msg);
        }
    },
    showModal: function (content) {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: false,
            confirmText: '知道了',
        })
    },
    /* 开通会员 */
    buyMember: function () {
        wx.navigateTo({url: '/pages/indexMbOpen/indexMbOpen'});
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        var res = await this.freeMemberCheck();
        this.data.signDays = res.data.count;
        this.data.hasSignToday = res.data.hasSignToday;
        this.data.sign_member = res.data.member;
        app.globalData.userInfo['sign_member'] = res.data.member;

        $digest(this);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
    onShareAppMessage: function (res) {
        console.log(res);
    }
})