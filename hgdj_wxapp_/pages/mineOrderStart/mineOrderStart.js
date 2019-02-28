// pages/mineOrderStart/mineOrderStart.js
import {$request} from "../../lib/page.auth";

const {regeneratorRuntime} = global;
let api = require('../../utils/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hour: 4,
        minute: 0,
        second: 0,
    },
    clipboardTap: function () {
        wx.setClipboardData({
            data: this.data.order.contact,
        })
    },
    startTap: function () {
        var that = this;
        wx.showModal({
            title: '提醒',
            content: '确认开始游戏吗?',
            success: function (res) {
                console.log(res.confirm);
                if (res.confirm) {
                    let res2 = that.startOrder().then(res => {
                        console.log(res);
                        if (res.code) {
                            wx.showToast({
                                title: '已经确认开始游戏',
                                icon: 'none',
                            });
                            wx.navigateTo({
                                url: '/pages/mineOrder/mineOrder?uid=' + that.data.uid,
                            })
                        } else {
                            wx.showModal({
                                title: '提醒',
                                content: '操作失败，尝试刷新后重新接单'
                            });
                        }
                    });
                    // wx.navigateTo({
                    //     url: '/pages/playConfirmOver/playConfirmOver',
                    // })
                }
            },
        })
    },
    async startOrder() {
        var res = await $request({
            url: api.order_status_change,
            data: {id: this.data.id, status: 4},
            method: 'POST'
        });
        return res;
    },
    async getOrderDetail() {
        console.log(this.data);
        var res = await $request({
            url: api.order_detail,
            method: 'POST',
            data: {id: this.data.id}
        });
        console.log(res);
        return res;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({id: options.id, uid: options.uid});
        var hour = this.data.hour,
            minute = this.data.minute,
            second = this.data.second;
        var that = this;
        var timer = setInterval(function () {
            if (second > 0) {
                second--;
            } else if (second == 0 && minute > 0) {
                minute--;
                second = 59;
            } else if (second == 0 && minute == 0 && hour > 0) {
                hour--;
                minute = 59;
                second = 59;
            } else {
                console.log(hour, minute, second);
            }
            that.setData({
                hour: hour,
                minute: minute,
                second: second
            })
        }, 1000);
        let res = await this.getOrderDetail();
        let order = JSON.parse(res.data);
        this.setData({order: order});
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