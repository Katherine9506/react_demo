import {$request} from '../../lib/page.auth'

const {regeneratorRuntime} = global;

let api = require('../../utils/api.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_status: ['', '待支付', '等待接单', '等待开始', '陪玩中', '等待验收', '待评价', '已评价', '已取消', '已取消'],
        hour: 0,
        minute: 0,
        second: 0,
        order: {},
        timer: 0,
    },
    /* 支付失败或取消后的支付 */
    async payOrder(e) {
        var order_id = e.currentTarget.dataset.order_id;
        const res = await $request({url: api.order_pay, data: {id: order_id}, method: 'POST'});
        let data = JSON.parse(res.data);
        console.log('订单支付打印信息：', data);

        wx.requestPayment({
            "timeStamp": data.timeStamp,
            "nonceStr": data.nonceStr,
            "package": data.package,
            "signType": data.signType,
            "paySign": data.paySign,
            "success": function (res) {
                wx.navigateTo({
                    url: '/pages/mineOrderDetail/mineOrderDetail?id=' + order_id,
                })
            },
            "fail": function (res) {
                wx.showModal({
                    title: '支付失败',
                    showCancel: false,
                    content: '支付出现一些问题，请尝试重新支付',
                    success: function (res) {
                        wx.navigateTo({
                            url: '/pages/mineOrderDetail/mineOrderDetail?id=' + order_id,
                        })
                    }
                })
            }
        });
    },
    clipboardTap: function () {
        wx.setClipboardData({
            data: this.data.order.contact,
        })
    },
    async getOrderDetail() {
        var res = await $request({
            url: api.order_detail,
            method: 'POST',
            data: {id: this.data.id}
        });
        return res;
    },
    //选择技能价格
    toBuyTap: function (e) {
        let id = e.currentTarget.dataset.id;
        if (id === 0) {
            wx.showModal({
                title: '陪玩师不在线！',
                showCancel: false,
                content: '当前陪玩时不在线，请稍后再试！',
                success: function (res) {

                }
            });
            return;
        }
        wx.navigateTo({
            url: '/pages/indexBuy/indexBuy?id=' + id + '&user_id=' + this.data.user.id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({id: options.id});
        var hour = this.data.hour,
            minute = this.data.minute,
            second = this.data.second;
        var that = this;

        let res = await this.getOrderDetail();
        let order = JSON.parse(res.data);

        /* 根据剩余时间设定倒计时 */
        if (order.cancelable && order.hasOwnProperty('remain_time') && order.remain_time > 0) {
            var remainTime = order.remain_time;
            minute = parseInt(remainTime / 60);
            second = remainTime % 60;
            console.log('剩下的时间：' + minute + "分" + second + "秒");
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
                    clearInterval(that.data.timer);
                    wx.showToast({
                        icon: 'none',
                        title: '订单已自动取消',
                    });
                    var order = that.data.order;
                    order.cancelable = false;
                    if (order.status == 1) {
                        order.status = 8;
                        // var pages = getCurrentPages(); // 当前页面
                        // var beforePage = pages[pages.length - 2]; // 前一个页面
                        // beforePage.asyncOrderStatus(order.status);
                    }
                    that.setData({order: order});
                }
                that.setData({
                    hour: hour,
                    minute: minute,
                    second: second
                })
            }, 1000);
            this.setData({timer: timer});
        }

        console.log('订单详情');
        console.log(order);
        this.setData({
            order: order,
            user: app.globalData.user
        });
    },
    /* 订单状态改变时刷新页面 */
    async refreshPage() {
        var res = await this.getOrderDetail();
        this.setData({order: JSON.parse(res.data)});
        console.log(JSON.parse(res.data));
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
        clearInterval(this.data.timer);
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