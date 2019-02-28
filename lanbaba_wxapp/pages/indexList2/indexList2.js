// pages/indexList/indexList.js
import {$digest, $init} from '../../lib/page.data'
import {$request} from '../../lib/page.auth'

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
        audioList: [],//音频列表
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
        this.setData({
            mbModal: false
        })
    },
    tabTap: function (e) {
        console.log(e.target.dataset.id);
        this.setData({
            tabId: e.target.dataset.id
        })
    },
    musicTap: function (e) {
        var dataset = e.currentTarget.dataset;
        app.globalData.currentIndex = dataset.index;
        wx.navigateTo({
            url: '/pages/indexPlay/indexPlay?audio_id=' + dataset.id + '&audio_title=' + dataset.title,
        })
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
        wx.setNavigationBarTitle({
            title: options.album_title
        });

        var res = await $request({url: api.album_show, data: {album_id: that.data.album_id}});
        that.data.album = res.data;

        res = await that.getAlbumAudios();
        that.data.audioList = res.data.data;
        that.data.totalAudios = res.data.total;
        app.globalData.audioCycles = res.data.data;

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
            /* 无更多数据 */
            wx.showToast({icon: 'none', title: '没有更多数据'});
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})