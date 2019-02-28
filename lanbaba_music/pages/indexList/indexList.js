// pages/indexList/indexList.js
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
    data: {
        heightRpx: '',
        tabId: 1,
        mbModal: false,
        _host: api.host,
        audioList: [],
        pageable: true,
        currentPage: 1
    },
    memberTap: function (e) {
        this.setData({
            mbModal: true
        })
    },
    cancelTap: function (e) {
        this.setData({
            mbModal: false
        })
    },
    confirmTap: function (e) {
        wx.navigateTo({
            url: '/pages/indexMbOpen/indexMbOpen'
        });
        this.setData({
            mbModal: false
        });
    },
    tabTap: function (e) {
        console.log(e.target.dataset.id);
        this.setData({
            tabId: e.target.dataset.id
        })
    },
    /* 检测用户会员状态 */
    async getUserDetail() {
        var res = await $request({
            url: api.user_detail,
            data: {uuid: this.data.user.id}
        });
        console.log(res);
        return res;
    },
    async musicTap(e) {
        var dataset = e.currentTarget.dataset;
        if (dataset.is_vip) {
            if (this.data.user.hasOwnProperty('is_member')) {
                if (!this.data.user.is_member) {
                    this.showModal('抱歉，您还不是会员，不能播放会员音频。开通会员免费听^_^');
                    return false;
                }
            } else {
                var res = await this.getUserDetail();
                var data = res.data;
                this.data.user['is_member'] = data.is_member;
                this.setData({user: this.data.user});
                app.globalData.userInfo['is_member'] = data.is_member;
                if (!data.is_member) {
                    this.showModal('抱歉，您还不是会员，不能播放会员音频。开通会员免费听^_^');
                    return false;
                }
            }
        }
        app.globalData.audioIndex = dataset.index;
        wx.navigateTo({
            url: '/pages/indexPlay/indexPlay?audio_id=' + dataset.id,
        })
    },
    showModal: function (content) {
        wx.showModal({
            title: '温馨提示',
            content: content,
            showCancel: false,
            confirmText: '知道了',
        });
    },
    /* 购买会员 */
    buyMember: function () {
        wx.navigateTo({url: '/pages/indexMbOpen/indexMbOpen'});
    },
    /* 获取专辑内音乐列表 */
    async getAlbumAudios() {
        var res = await $request({
            url: api.album_audios,
            data: {album_id: this.data.album_id}
        });

        if (res.current_page === res.last_page) {
            this.data.pageable = false;
        }
        this.data.currentPage++;
        this.setData({
            pageable: this.data.pageable,
            currentPage: this.data.currentPage
        });
        return res;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        var that = this;
        $init(that);
        that.data.album_id = options.album_id;

        wx.getSystemInfo({
            success: function (res) {
                var clientH = res.windowHeight,
                    clientW = res.windowWidth,
                    rpxR = 750 / clientW;
                var calcH = clientH * rpxR - 98;
                that.setData({
                    heightRpx: calcH
                })
            },
        });


        var res = await $request({url: api.album_show, data: {album_id: that.data.album_id}});
        that.data.album = res.data;

        res = await that.getAlbumAudios();
        that.data.audioList = res.data.data;
        that.data.totalAudios = res.data.total;
        app.globalData.audioCycles = res.data.data;

        if (app.globalData.hasUserInfo) {
            this.data.user = app.globalData.userInfo;
        }

        $digest(that);
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
    async onReachBottom() {
        if (this.data.pageable) {
            wx.showToast({icon: 'none', title: '加载中'});
            var res = await this.getAlbumAudios();
            this.setData({
                audioList: this.data.audioList.concat(res.data.data),
            });
            app.globalData.audioCycles = this.data.audioList;
        } else {
            wx.showToast({icon: 'none', title: '没有更多音频了^_^'});
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})