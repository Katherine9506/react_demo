// pages/indexMore/indexMore.js
import {$digest, $init} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
const app = getApp();
let api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _host: api.host,
        currentPage: 1,
        pageable: true,
        rangLsit: ['全部', '哄睡', '律动', '故事', '朗读', '歌曲', '美音', '英音', '讲解', '音乐'],
        rangOn: 0,
    },
    rangBarTap: function (e) {
        this.setData({
            rangOn: e.currentTarget.dataset.id
        })
    },
    /* 获取分类下专辑列表 */
    async getAlbums() {
        var res = await $request({
            url: api.album_category_albums,
            data: {category_id: this.data.album_category_id, page: this.data.currentPage}
        });
        return res;
    },
    albumDetailTap: function (e) {
        var is_vip = e.currentTarget.dataset.is_vip;
        var url = is_vip ? '/pages/indexList/indexList' : '/pages/indexList2/indexList2';
        wx.navigateTo({
            url: url + '?album_id=' + e.currentTarget.dataset.album_id
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        this.data.album_category_id = options.album_category_id;//指定专辑分类

        var res = await this.getAlbums();
        this.data.albums = res.data.data;
        this.data.currentPage++;
        this.data.pageable = res.current_page == res.last_page ? false : true;

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
        var res = await this.getAlbums();
        this.data.albums.concat(res.data.data);
        this.data.currentPage++;
        this.data.pageable = res.current_page == res.last_page ? false : true;
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})