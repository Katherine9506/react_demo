// pages/indexSearch/indexSearch.js
import {$digest, $init} from '../../lib/page.data'
import {$request} from '../../lib/page.auth'
import {trim} from '../../utils/util'

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
        recommends: ['三字经', '诗词五百首', '小红帽', '格林童话', '白雪公主', '七个小矮人'],
        searchHistory: [],
        hideRecommend: false,
        hideProduct: false,
        albums: [],
        audios: [],
        searchContent: ''
    },
    /* 删除特定历史搜索记录 */
    clearSpecifiedSearchHistory(e) {
        var index = e.currentTarget.dataset.index;
        var searchHistory = this.data.searchHistory;
        searchHistory.splice(index, 1);
        this.setData({
            searchHistory: searchHistory
        });
        wx.setStorageSync('searchHistory', searchHistory);
    },
    /* 清空历史搜索记录 */
    clearSearchHistory() {
        this.setData({
            searchHistory: []
        });
        wx.setStorageSync('searchHistory', []);
    },
    /* 清空搜索框 */
    clearSearchContent() {
        console.log('clearSearchContent');
        this.setData({
            searchContent: ''
        });
    },
    /* 点击专辑 */
    albumDetailTap(e) {
        var album_id = e.currentTarget.dataset.id;
        var album_is_vip = e.currentTarget.dataset.is_vip;
        var album_title = e.currentTarget.dataset.title;
        if (album_is_vip) {
            wx.navigateTo({
                url: '/pages/indexList/indexList?album_id=' + album_id + "&album_title=" + album_title,
            });
            return false;
        } else {
            wx.navigateTo({
                url: '/pages/indexList2/indexList2?album_id=' + album_id + "&album_title=" + album_title,
            });
            return false;
        }
    },
    /* 点击音频 */
    async audioDetailTap(e) {
        var dataset = e.currentTarget.dataset;
        if (dataset.is_vip && !app.globalData.userInfo.is_member) {
            app.showModal('抱歉，您还不是会员，不能播放会员音频。开通会员免费听^_^');
            return false;
        }
        var index = app.globalData.audioCycles.length;
        app.globalData.audioCycles.push(this.data.audios.data[dataset.index]);
        app.globalData.currentIndex = index;
        wx.navigateTo({
            url: '/pages/indexPlay/indexPlay?audio_id=' + dataset.id + "&audio_title=" + dataset.title,
        })
    },
    /* 取消按钮 */
    backToIndex() {
        wx.navigateBack({
            delta: 1
        });
    },
    /* 搜索输入触发 */
    searchFocusHandler() {
        this.setData({
            hideRecommend: false
        })
    },
    searchBlurHandler(e) {
        if (!this.data.albums.total && !this.data.audios.total) {
            return;
        }
        this.setData({
            hideRecommend: true
        })
    },
    /* 搜索 */
    async search(content) {
        var res = await $request({
            url: api.search,
            method: 'POST',
            data: {content: content}
        });
        console.log('搜索结果：', res);
        return res;
    },
    async inputSearchHandler(e) {
        await this.searchHandler(e.detail.value);
    },
    async recommendSearchHistory(e) {
        await this.searchHandler(e.currentTarget.dataset.content);
    },
    /* 搜索 Event Handle */
    async searchHandler(content) {
        wx.showLoading({
            title: '搜索中',
            mask: true
        });
        content = trim(content);
        this.setSearchHistory(content);
        var res = await this.search(content);
        var albums = res.data.albums;
        var audios = res.data.audios;
        this.data.hideRecommend = albums.total || audios.total;
        this.setData({
            audios: audios,
            albums: albums,
            hideRecommend: this.data.hideRecommend
        });
        wx.hideLoading();
        if (!this.data.hideRecommend) {
            wx.showToast({
                icon: 'none',
                title: '抱歉呢，暂无匹配数据'
            })
        }
    },
    /* 存储搜索记录 */
    setSearchHistory(history) {
        if (history != '') {
            var searchHistory = this.data.searchHistory;
            searchHistory.unshift(history);
            this.setData({
                searchHistory: searchHistory
            });
            wx.setStorageSync('searchHistory', searchHistory);
        }
    },
    /* 取出本地搜索记录 */
    getSearchHistory() {
        this.setData({
            searchHistory: wx.getStorageSync('searchHistory') || [],
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        /* 初始化热门搜索 搜索记录 */
        this.getSearchHistory();

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
});