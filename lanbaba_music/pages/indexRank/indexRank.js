// pages/indexRank/indexRank.js
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
        _host: api.host,
        categories: [{id: 0, title: '全部'}],
        rangOn: 0,
        audioList: [],//音频列表
        pageable: true,
        currentPage: 1,
    },
    async rangBarTap(e) {
        this.setData({
            rangOn: e.currentTarget.dataset.index,
            currentPage: 1,
            pageable: true
        });
        /* 切换类别，加载数据 */
        var res = await this.getAudiosByCategory();
        this.data.audioList = res.data.data;
        this.setData({
            audioList: this.data.audioList
        });
        /* 保存全局音频列表 */
        app.globalData.audioCycles = this.data.audioList;
    },
    /* 点击音乐详情 */
    musicTap: function (e) {
        /* 保存全局音频索引audioIndex */
        app.globalData.audioIndex = e.currentTarget.dataset.index;
        var is_vip = e.currentTarget.dataset.vip;
        if (is_vip) {
            this.showModal('抱歉，您还不是会员，不能播放会员音频。开通会员免费听^_^');
        } else {
            wx.navigateTo({
                url: '/pages/indexPlay/indexPlay',
            });
        }
    },
    /* 获取音频列表 */
    async getAudiosByCategory() {
        var res = await $request({
            url: api.audio_category_audios,
            data: {category_id: this.data.categories[this.data.rangOn].id, page: this.data.currentPage}
        });
        console.log(res);
        if (res.data.current_page == res.data.last_page) {
            this.data.pageable = false;
        }
        this.data.currentPage++;
        this.setData({
            pageable: this.data.pageable,
            currentPage: this.data.currentPage
        });
        return res;
    },
    showModal: function (content) {
        wx.showModal({
            title: '温馨提示',
            content: content,
            cancelText: '知道了',
            confirmText: '开通会员',
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({url: '/pages/indexMbOpen/indexMbOpen'});
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        var res = await $request({
            url: api.audio_categories
        });
        this.data.categories = this.data.categories.concat(res.data);

        res = await this.getAudiosByCategory();
        this.data.audioList = res.data.data;
        /* 保存全局音频列表 */
        app.globalData.audioCycles = this.data.audioList;

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
    async onReachBottom() {
        if (this.data.pageable) {
            wx.showToast({icon: 'none', title: '加载中'});
            var res = await this.getAudiosByCategory();
            this.data.audioList = this.data.audioList.concat(res.data.data);
            this.setData({audioList: this.data.audioList});
            /* 保存全局音频列表 */
            app.globalData.audioCycles = this.data.audioList;
        } else {
            wx.showToast({
                icon: 'none',
                title: '没有更多音频了呢'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});
