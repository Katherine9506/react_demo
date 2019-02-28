// pages/mineOrderComfirm/mineOrderComfirm.js
import {$request} from '../../lib/page.auth'

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
        order: [],
    },
    clipboardTap: function () {
        wx.setClipboardData({
            data: this.data.order.contact,
        })
    },
    toEvaluTap: function () {
        wx.navigateTo({
            url: '/pages/playEvaluateDetail/playEvaluateDetail',
        })
    },
    async confirmTakeTap() {
        var that = this;
        wx.showModal({
            title: '提醒',
            content: '确认接受接单吗?',
            success: function (res) {
                console.log(res.confirm);
                if (res.confirm) {
                    console.log(res.confirm);
                    let res2 = that.confirmOrder().then(res => {
                        console.log(res);
                        if (res.code) {
                            //发送推送消息
                            $request({
                                url: api.send_template_message,
                                method: 'POST',
                                data: {
                                    templateId: api.messageTemplates.SUCCESS_IMFORM,
                                    orderId: that.data.id,
                                }
                            });

                            wx.showModal({
                                title: '提醒',
                                content: '接单成功',
                                confirmText: '开始游戏',
                                success: function (res) {
                                    if (res.confirm) {
                                        wx.navigateTo({
                                            url: '/pages/mineOrderStart/mineOrderStart?id=' + that.data.id + '&uid=' + that.data.uid,
                                        })
                                    } else {
                                        wx.navigateTo({
                                            url: '/pages/mineOrder/mineOrder?uid=' + that.data.uid,
                                        })
                                    }
                                }
                            });

                        } else {
                            wx.showModal({
                                title: '提醒',
                                content: res.msg
                            });
                        }
                    });
                }
            },
        })

    },
    async confirmOrder() {
        var res = await $request({
            url: api.order_status_change,
            data: {id: this.data.id, status: 3},
            method: 'POST'
        });
        return res;
    },
    async getOrderDetail() {
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