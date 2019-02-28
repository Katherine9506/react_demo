// pages/phone/phone.js
import {checkPhone, trim} from '../../utils/util'
import {$digest, $init} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module');
let app = getApp();
let api = require('../../utils/api.js');
var timer = null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        disabled: false,
        time: 60,
        txt: '获取验证码',
        phone: '',
        captcha: '',
        phoneFocus: true,
    },
    /* 绑定手机号 */
    async bindPhoneFormSubmitHandler(e) {
        console.log('绑定手机号');
        if (!checkPhone(this.data.phone)) {
            wx.showToast({icon: 'none', 'title': '手机号码不符合规范'});
            this.setData({phoneFocus: true});
            return false;
        }
        var res = await $request({
            url: api.user_bind_phone,
            data: {uuid: app.globalData.userInfo.id, phone: this.data.phone, captcha: trim(this.data.captcha)}
        });
        wx.showToast({icon: 'none', 'title': res.msg});
        if (res.data) {
            app.globalData.userInfo['phone'] = trim(this.data.phone);
            app.globalData.userInfo['phoneBind'] = true;
            var session = Session.get();
            session.userInfo['phone'] = app.globalData.userInfo['phone'];
            Session.set(session);
            if (this.data.album_is_vip) {
                wx.navigateTo({
                    url: '/pages/indexList/indexList?album_id=' + this.data.album_id,
                });
                return;
            } else {
                wx.navigateTo({
                    url: '/pages/indexList/indexList2?album_id=' + this.data.album_id,
                });
                return;
            }
        }
    },
    /* 监听手机号码改变 */
    phoneChange: function (e) {
        this.data.phone = e.detail.value;
    },
    /* 监听验证码输入 */
    captchaChange: function (e) {
        this.data.captcha = e.detail.value;
    },
    /* 获取验证码 */
    async getCode(e) {
        if (!checkPhone(this.data.phone)) {
            wx.showToast({icon: 'none', 'title': '手机号码不符合规范'});
            this.setData({phoneFocus: true});
            return false;
        }

        var time = 60;
        var that = this;
        this.setData({
            disabled: true,
            txt: '60s'
        });
        timer = setInterval(function () {
            var txt = '';
            if (time > 1) {
                time--;
                txt = time + 's';
                that.setData({
                    txt: txt
                })
            } else {
                txt = '获取验证码';
                that.setData({
                    txt: txt,
                    disabled: false
                });
                clearInterval(timer);
            }
        }, 1000);
        var res = await $request({
            url: api.user_get_captcha,
            data: {phone: trim(this.data.phone)}
        });
        wx.showToast({icon: 'none', title: res.msg});
        if (res.code != 200) {
            this.setData({txt: '获取验证码', disabled: false});
            clearInterval(timer);
        }
    },
    /* 清空手机号 */
    clearPhone: function (e) {
        this.setData({phone: ''});
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        $init(this);
        this.data.album_id = options.album_id;
        this.data.album_is_vip = options.album_is_vip;
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
    onShareAppMessage: function () {

    }
})
