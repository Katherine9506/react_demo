import {$digest, $init} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');
let emojis = require('../../emoji/emoji');
/* 引入wxSearch js */
var WxSearch = require('../../wxSearch/wxSearch.js')
const app = getApp();

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
    },
    //选择技能价格
    toBuyTap: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/indexBuy/indexBuy?id=' + id + '&user_id=' + this.data.user.id
        })
    },
    //获取某一技能更多价格列表
    moreTap: function (e) {
        let skill_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/indexNavipage/indexNavipage?id=' + skill_id,
        })
    },
    async onLoad(options) {
        $init(this);

        try {
            const session = Session.get();
            console.log(session);

            if (session) {
                const login_res = await $request({url: api.is_login, data: {}, method: 'GET'});
                if (login_res.code) {
                    this.data.userInfo = session.userInfo;
                } else {
                    Session.clear();
                    const userInfo = await $login();
                    this.data.userInfo = userInfo;
                }
                this.data.userInfo = JSON.parse(this.data.userInfo);

                //请求技能列表
                let skill_list = await this.getSkills();
                this.data.skill_list = skill_list.data;

                //获取首页价格列表
                let price_list = await this.getPriceList();
                this.data.priceList = price_list;

                var res = await $request({
                    url: api.user_info,
                    data: {openid: this.data.userInfo.openId},
                    method: 'GET'
                });
                this.data.user = JSON.parse(res.data);
                app.globalData.user = this.data.user;
                app.globalData.hasUser = true;

                //获取聊天对象
                var res = await this.getChaters();
                var data = res.data;
                var chaters = {};
                for (let i = 0; i < data.length; i++) {
                    chaters[data[i].pivot.chater_id] = data[i];
                }
                /* 初次加载，初始化全局聊天对象 */
                app.globalData.chaters = chaters;
                console.log(app.globalData.chaters);

                this.firstSocketMessage();
                this.getNotReadCount();

                //初始化微信搜索
                //初始化的时候渲染wxSearchdata 第二个为你的search高度
                WxSearch.init(this, 43, []);
                WxSearch.initMindKeys([]);

                $digest(this)
            }
            else {
                try {
                    const userInfo = await $login();
                    this.data.userInfo = JSON.parse(userInfo);

                    //请求技能列表
                    let skill_list = await this.getSkills();
                    this.data.skill_list = skill_list.data;

                    //获取首页价格列表
                    let price_list = await this.getPriceList();
                    this.data.priceList = price_list;

                    var res = await $request({
                        url: api.user_info,
                        data: {openid: this.data.userInfo.openId},
                        method: 'GET'
                    });
                    this.data.user = JSON.parse(res.data);
                    app.globalData.user = this.data.user;
                    app.globalData.hasUser = true;

                    var res = await this.getChaters();
                    var data = res.data;
                    var chaters = {};
                    for (let i = 0; i < data.length; i++) {
                        chaters[data[i].pivot.chater_id] = data[i];
                    }
                    /* 初次加载，初始化全局聊天对象 */
                    app.globalData.chaters = chaters;

                    this.firstSocketMessage();
                    this.getNotReadCount();

                    $digest(this)
                }
                catch (err) {
                    console.log("+++1+++ error:", err)
                }
            }
        }
        catch (err) {
            console.log("+++2+++ error:", err)
            wx.showModal({
                title: '错误提示！',
                showCancel: false,
                content: '网络环境出问题了，请换个地方再试一次！',
                success: function (res) {

                },
            })
        }
    },
    /* 微信搜索组件WxSearch相关事件 */
    wxSearchFn: function (e) {
        console.log('搜索关键字为：', e.detail.value);
        var that = this;
        WxSearch.wxSearchAddHisKey(that);
        //跳转至搜索结果页面
        wx.navigateTo({url: '/pages/search/search?name=' + e.detail.value})
    },
    wxSearchInput: function (e) {
        var that = this;
        WxSearch.wxSearchInput(e, that);
    },
    wxSerchFocus: function (e) {
        var that = this;
        WxSearch.wxSearchFocus(e, that);
    },
    wxSearchBlur: function (e) {
        var that = this;
        WxSearch.wxSearchBlur(e, that);
    },
    wxSearchKeyTap: function (e) {
        var that = this;
        WxSearch.wxSearchKeyTap(e, that);
    },
    wxSearchDeleteKey: function (e) {
        var that = this;
        WxSearch.wxSearchDeleteKey(e, that);
    },
    wxSearchDeleteAll: function (e) {
        var that = this;
        WxSearch.wxSearchDeleteAll(that);
    },
    wxSearchTap: function (e) {
        var that = this;
        WxSearch.wxSearchHiddenPancel(that);
    },

    async getPriceList() {
        const res = await $request({url: api.price_list, method: 'POST'});
        let price_list = JSON.parse(res.data);
        console.log('价格列表：', price_list);
        return price_list
    },

    async getSkills() {
        const res = await $request({url: api.skill_list, method: 'POST'});
        let skill_list = JSON.parse(res.data);
        console.log("技能数据:", skill_list);
        return skill_list
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
        wx.showTabBar({})
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

    firstSocketMessage: function () {
        let msg = {
            message: 'Keep live.',
            is_init_connet: true,
            send_uid: this.data.user.id,
        };
        console.log('第一条数据：' + JSON.stringify(msg));
        app.prepareSocket(function () {
            wx.sendSocketMessage({
                data: JSON.stringify(msg),
                success: function (res) {
                    console.log('发送数据成功');
                }
            })
        });
    },
    async getNotReadCount() {
        var res = await $request({
            url: api.chat_notread_all + '?user_id=' + this.data.user.id,
            method: 'GET',
        });
        if (res.code == 200) {
            app.globalData.sumUnRead = res.data;
            if (res.data > 0) {
                wx.setTabBarBadge({
                    index: 2,
                    text: '' + app.globalData.sumUnRead,
                });
            }
        }
    },
    async getChaters() {
        var that = this;
        var res = await $request({
            url: api.chaters + '?user_id=' + that.data.user.id
        });
        console.log(res);
        return res;
    },
})
