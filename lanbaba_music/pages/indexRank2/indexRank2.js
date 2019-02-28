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
        rangLsit: ['全部'],
        rangOn: 0,
        albumList: [],//专辑列表
        pageable: true,//是否可分页
        currentPage: 1,//当前页
    },
    rangBarTap: function (e) {
        this.setData({
            rangOn: e.currentTarget.dataset.id
        })
    },
    albumTap: function (e) {
        var dataset = e.currentTarget.dataset;
        if (dataset.is_vip) {
            wx.navigateTo({
                url: '/pages/indexList/indexList?album_id=' + dataset.album_id,
            })
        }
        wx.navigateTo({
            url: '/pages/indexList2/indexList2?album_id=' + dataset.album_id,
        })
    },
    /* 获取该专辑标签下的专辑列表 */
    async getAlbumsViaTag() {
        var res = await $request({
            url: api.album_tag_album,
            data: {tag_id: this.data.tag_id, page: this.data.currentPage}
        });
        console.log(res);
        /* 处理分页 */
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
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        this.data.tag_id = options.tag_id;
        wx.setNavigationBarTitle({
            title: options.tag_name
        });
        this.setData({tag_id: this.data.tag_id});
        var res = await this.getAlbumsViaTag();
        this.data.albumList = res.data.data;

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
            var res = await this.getAlbumsViaTag();
            this.data.albumList = this.data.albumList.concat(res.data.data);
            this.setData({albumList: this.data.albumList});
        } else {
            wx.showToast({
                icon: 'none',
                title: '没有更多专辑了呢'
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})