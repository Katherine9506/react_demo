import {$init} from '../../lib/page.data'
import {$request} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        domain:api.oss_domain,
        beauty: [],
        timeLong: 1,
        onloadShow: true
    },
    lookDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/indexBuy/indexBuy?id=' + id,
        })
    },
    //获取匹配玩家
    async getMatcher() {
        var that = this;
        var res = await $request({
            url: api.price_list_via_search,
            method: 'POST',
            data: {name: that.data.name}
        });
        return res;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);
        this.data.name = options.name;
        try {
            var res = await this.getMatcher();
            var skillPriceList = JSON.parse(res.data);
            console.log(skillPriceList);
            this.setData({
                'beauty': skillPriceList,
            })
        } catch (e) {
            console.log('##########error2:', e);
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var that = this;
        var timeLong = this.data.timeLong;
        var timer = setInterval(function () {
            timeLong--;
            if (timeLong == 0) {
                that.setData({
                    onloadShow: false
                });
                clearInterval(timer);
            }
        }, 1000)

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log(3)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log(4)
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