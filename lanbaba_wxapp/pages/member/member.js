// pages/member/member.js
import {getTodayDate} from "../../utils/util";
import {$request, Session} from "../../lib/page.auth";

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module');
const app = getApp();
let api = require('../../utils/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {},
    dakaTap: function () {
        wx.navigateTo({
            url: '/pages/memberClock/memberClock',
        })
    },
    inviteTap: function () {
        wx.navigateTo({
            url: '/pages/memberInvit/memberInvit',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        var today = getTodayDate(new Date());
        console.log('今天：', today);
        if (app.globalData.hasUserInfo) {
            if (!app.globalData.memberCheckDate || app.globalData.memberCheckDate != today) {
                app.globalData.memberCheckDate = today;
                app.globalData.todayMemberCheck = false;
            }
            if (!app.globalData.todayMemberCheck) {
                var res = await this.checkMemberValid();
                if (res.code == 200) {
                    app.globalData.todayMemberCheck = true;
                    var old_is_member = app.globalData.userInfo['is_member'];
                    var is_member = res.data.is_member;
                    var session = Session.get();
                    session.userInfo['is_member'] = is_member;
                    session.userInfo['expire_date'] = res.data.expire_date;
                    Session.set(session);
                    app.globalData.userInfo['is_member'] = is_member;
                    app.globalData.userInfo['expire_date'] = res.data.expire_date;
                    console.log(app.globalData);
                    if (old_is_member) {
                        wx.showModal({
                            title: '温馨提示',
                            cancelText: '知道了',
                            confirmText: '前往续费',
                            content: '会员已过期!',
                            success(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/indexMbOpen/indexMbOpen',
                                    })
                                }
                            }
                        });
                    }
                } else {
                    wx.showToast({icon: 'none', title: res.msg});
                }
            }
        }
    },
    /* 检查会员状态 */
    async checkMemberValid() {
        var res = await
            $request({
                url: api.user_check_member_valid,
                data: {uuid: app.globalData.userInfo.id}
            });
        console.log('检查会员状态');
        console.log(res);
        return res;
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