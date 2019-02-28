import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');
let http = require('../../utils/http.js');
let util = require('../../utils/util.js');
const app = getApp();
// pages/myOrder/myOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navTab: ['全部订单', '我是陪玩师', '我是老板'],
        tabPage: [1, 1, 1],
        onReachBottoms: [true, true, true],
        winHeight: "",//窗口高度
        currentTab: 0,
        tabDesc: ['all', 'play', 'boss'],
        orderList: [],
        currentOrderList: [],
        order_list: {0: [], 1: [], 2: []},
        order_status: ['', '待支付', '等待接单', '等待开始', '陪玩中', '等待验收', '待评价', '已评价', '已取消', '已取消'],
        boss_status: ['取消订单', '待支付', '提醒接单', '提醒开始', '陪玩中', '确认完成', '立即评价', '已评价', '已取消', '已取消'],
        player_status: ['', '待支付', '确认接单', '确认开始', '提交验收', '等待验收', '待评价', '已评价', '已取消']
    },
    /* ==========================老板操作================================= */
    async bossOpHandler(e) {
        let formId = e.detail.formId;
        await util.getFormIds(formId);

        let dataset = e.currentTarget.dataset;
        console.log(e);
        switch (dataset.status) {
            case "0":
                this.cancelOrder(e);
                break;
            case 1:
                this.topayTap(e); //支付
                break;
            case 2:
                this.remindOrder(e); //提醒接单
                break;
            case 3:
                this.remindStartTap(e);//提醒开始
                break;
            case 5:
                this.confirmOrder(e);//确认完成
                break;
            case 6:
                this.commentOrder(e);//立即评价
                break;
        }
    },
    //取消订单
    async cancelOrder(e) {
        var that = this;
        console.log('开始取消订单');
        var cancel = false;
        wx.showModal({
            title: '提示',
            content: '取消订单操作不可更改，谨慎操作。确定取消吗?',
            async success(res2) {
                if (res2.confirm) {
                    var dataset = e.currentTarget.dataset;
                    var res = await $request({
                        url: api.order_cancel,
                        data: {order_id: dataset.oid},
                        method: 'POST'
                    });
                    console.log(res);
                    var order = that.data.currentOrderList[dataset.index];
                    order.status = res.data.status;
                    order.cancelable = false;
                    that.data.currentOrderList[dataset.index] = order;
                    that.setData({currentOrderList: that.data.currentOrderList});
                    /* 更新用户本地余额 */
                    app.globalData.user.balance = Math.round(app.globalData.user.balance * 100 + res.data.price * 100) / 100;

                    wx.showToast({
                        icon: 'none',
                        title: res.msg,
                    });
                }
            }
        });
    },
    //同步状态--回调
    asyncOrderStatus: function (status) {
    },
    topayTap: function (e) {
        wx.navigateTo({
            url: '/pages/mineOrderDetail/mineOrderDetail?id=' + e.currentTarget.dataset.oid,
        })
    },
    //提醒开始
    async remindStartTap(e) {
        // var dataset = e.currentTarget.dataset;
        // var formId = dataset.formid;
        // var openId = dataset.openid;
        // var res = await $request({
        //     url: api.send_template_message,
        //     method: 'POST',
        //     data: {
        //         templateId: api.messageTemplates.TRANS_IMFORM,
        //         // formId: formId,
        //         orderId: dataset.oid,
        //         openId: openId,
        //     }
        // });
        // console.log(1212);
        // var content = res.code == 1 ? '提醒成功!' : '发送提醒失败！';
        wx.showModal({
            title: '提示',
            showCancel: false,
            content: "提醒成功!",
            success: function (res) {
            }
        })
    },
    //提醒接单
    remindOrder() {
        wx.showModal({
            title: '提示',
            showCancel: false,
            content: '提醒成功！',
            success: function (res) {
            }
        })
    },
    //确认完成
    async confirmOrder(e) {
        let dataset = e.currentTarget.dataset;
        var that = this;

        const res = await $request({url: api.order_status_change, data: {id: dataset.oid, status: 6}, method: 'GET'});
        console.log(res)
        if (res.code == 1) {
            that.data.currentOrderList[dataset.index].status = 6;
            that.setData({currentOrderList: that.data.currentOrderList});
            wx.showToast({
                title: res.msg,
                mask: true
            })
        }
        else {
            wx.showToast({
                title: '服务器不在状态，请稍后再试！',
                mask: true
            })
        }
    },
    //评价
    commentOrder(e) {
        let dataset = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/playEvaluateDetail/playEvaluateDetail?order_id=' + dataset.oid
                + '&name=' + this.data.currentOrderList[dataset.index].play_name
                + '&thumb=' + this.data.currentOrderList[dataset.index].play_thumb
                + '&index=' + dataset.index,
        })
    },
    commented(index) {
        this.data.currentOrderList[index].status = 7;
        this.setData({
            currentOrderList: this.data.currentOrderList
        })
    },
    /* =================================陪玩师操作 =================================*/
    async playerOpHandler(e) {
        let formId = e.detail.formId;
        await util.getFormIds(formId);

        let dataset = e.currentTarget.dataset;
        console.log(dataset);
        switch (dataset.status) {
            case 2:
                this.confirmTap(e);//确认接单：
                break;
            case 3:
                this.playStartTap(e);//确认开始
                break;
            case 4:
                this.confirmFinishTap(e);//游戏结束，提交验收
                break;
        }
    },
    confirmTap: function (e) {
        let dataset = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/mineOrderComfirm/mineOrderComfirm?id=' + dataset.oid + '&uid=' + this.data.uid,
        })
    },
    playStartTap: function (e) {
        let dataset = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/mineOrderStart/mineOrderStart?id=' + dataset.oid + '&uid=' + this.data.uid,
        })
    },
    confirmFinishTap: function (e) {
        let dataset = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/mineOrderAccep/mineOrderAccep?id=' + dataset.oid + '&uid=' + this.data.uid,
        })
    },


    toCheckTap: function () {
        wx.navigateTo({
            url: '/pages/mineOrderAccep/mineOrderAccep',
        })
    },

    toEvaluate: function () {
        wx.navigateTo({
            url: '/pages/playEvaluate/playEvaluate',
        })
    },

    async tabTap(e) {
        //重新请求数据
        let curTab = e.currentTarget.dataset.index;
        if (this.data.currentTab == curTab) {
            return false;
        }
        this.setData({
            currentTab: e.currentTarget.dataset.index
        });
        if (this.data.order_list[curTab].length > 0) {
            this.setData({currentOrderList: this.data.order_list[curTab]});
            return false;
        }
        await this.getOrderList();
    },

    swiperChange: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
    },


    playingTap: function () {
        wx.navigateTo({
            url: '/pages/playing/playing',
        })
    },
    toEvalueTap: function () {
        wx.navigateTo({
            url: '/pages/playEvaluate/playEvaluate',
        })
    },
    confirmOverTap: function () {
        wx.navigateTo({
            url: '/pages/playConfirmOver/playConfirmOver',
        })
    },
    waterEvaluteTap: function () {
        wx.navigateTo({
            url: '/pages/playEvaluateWait/playEvaluateWait',
        })
    },

    detailTap(e) {
        let order_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/mineOrderDetail/mineOrderDetail?id=' + order_id,
        })
    },
    async getOrderList() {
        const res = await $request({
            url: api.order_list,
            data: {type: this.data.tabDesc[this.data.currentTab], page: this.data.tabPage[this.data.currentTab]},
            method: 'POST'
        });
        let order_list = JSON.parse(res.data);
        if (order_list.current_page != order_list.last_page) {
            this.data.tabPage[this.data.currentTab] = order_list.current_page + 1;
        } else {
            this.data.onReachBottoms[this.data.currentTab] = false;
        }
        this.data.order_list[this.data.currentTab] = this.data.order_list[this.data.currentTab].concat(order_list.data);
        console.log(this.data.order_list);
        this.setData({
            order_list: this.data.order_list,
            onReachBottoms: this.data.onReachBottoms,
            currentOrderList: this.data.order_list[this.data.currentTab],
        });
        console.log(this.data.onReachBottoms);
        console.log(order_list)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        this.setData({uid: options.uid});
        try {
            const session = Session.get();
            if (session) {
                //获取订单列表
                var res = await this.getOrderList();

                var that = this;
                wx.getSystemInfo({
                    success: function (res) {
                        var clientH = res.windowHeight,
                            clientW = res.windowWidth,
                            rpxR = 750 / clientW;
                        var calcH = clientH * rpxR - 118;
                        that.setData({
                            switchBoxH: calcH
                        })
                    },
                });
                $digest(this)
            }
        }
        catch (err) {
            console.log("+++2+++ error:", err)
        }
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
        this.getOrderList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('page上拉触底');
        //加载更多订单
        if (this.data.onReachBottoms[this.data.currentTab]) {
            this.getOrderList();
        } else {
            console.log('无更多订单数据')
        }
        console.log('页面上拉触底事件处理结束');
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    //支付
    async payOrder(e) {
        console.log(e.currentTarget.dataset.id)

        const res = await $request({url: api.order_pay, data: {id: e.currentTarget.dataset.id}, method: 'POST'})
        let data = JSON.parse(res.data);
        console.log('订单支付打印信息：', data);

        wx.requestPayment({
            "timeStamp": data.timeStamp,
            "nonceStr": data.nonceStr,
            "package": data.package,
            "signType": data.signType,
            "paySign": data.paySign,
            "success": function (res) {
            },
            "fail": function (res) {
                wx.showModal({
                    title: '支付失败',
                    showCancel: false,
                    content: '支付出现一些问题，请尝试重新支付',
                    success: function (res) {

                    }
                })
            }
        });
    },
});