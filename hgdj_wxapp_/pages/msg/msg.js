// pages/msg/msg.js
import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
const app = getApp();
let api = require('../../utils/api.js');
let emojis = require('../../emoji/emoji');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        chaters: {},//聊天对象数组
        timer: 0,
        _wxapp: api.oss_domain + '/upload/wxapp',
    },
    msgDetailTap: function (e) {
        const data = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/msgDetail/msgDetail?user_id=' + this.data.user.id
                + '&chater_id=' + data.chater_id
                + '&chater_name=' + data.chater_name
                + '&chater_thumb=' + data.chater_thumb,
        })
    },
    //定时刷新，每一秒刷新列表
    refreshChatersStarter() {
        this.data.timer = setInterval(this.refreshChaters, 1000);
    },
    //刷新当前页面聊天对象列表
    //刷新tabbar消息按钮总未读消息显示数
    refreshChaters: function () {
        this.setData({chaters: app.globalData.chaters});
        app.updateTabBarBadeg();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);
        try {
            if (app.globalData.hasUser){
                this.data.user = app.globalData.user;
            }
            else{
                const session = Session.get();
                if (session){
                    this.data.userInfo = session.userInfo;
                    this.data.userInfo = JSON.parse(this.data.userInfo);
                    await this.getPageData();
                }
            }
            app.updateTabBarBadeg();
            var chaters = app.globalData.chaters;
            //onload，初始化 lastMsg->rich-text node
            for (var chater_id in chaters) {
                var chater = chaters[chater_id];
                chaters[chater.pivot.chater_id].lastMessage = emojis.emojiParse(this.data._wxapp, chater.lastMessage);
            }
            $digest(this);
        } catch (e) {
            console.log('##########error log:' + e);
        }
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
        //页面显示时，更新页面聊天对象列表
        if (Object.getOwnPropertyNames(app.globalData.chaters).length > 0) {
            console.log('直接渲染聊天对象列表...');
            this.setData({chaters: app.globalData.chaters});
        }
        //页面显示时，定时刷新当前页面聊天对象列表
        this.refreshChatersStarter();
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

    },
    //获取页面所需数据
    async getPageData() {
        const res = await $request({url: api.user_info, data: {openid: this.data.userInfo.openId}, method: 'GET'});
        this.data.user = JSON.parse(res.data);
        console.log(this.data.user);
    }
})