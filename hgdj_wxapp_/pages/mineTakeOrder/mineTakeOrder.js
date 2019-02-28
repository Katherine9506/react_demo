import {$init, $digest} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');

// pages/mineTakeOrder/mineTakeOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        domain: api.oss_domain,
        modalShow: false,
        modal2Show: false,
        severTime: 1,
        severPrice: '未设置',
        btnTxt: '开始接单',
        onOff: true,
        gamelist: [],
        nowId: 0,
        gameSetting: '',
        week: {total: 0, amount: 0},
        rate: 0,
    },

    //接单开启和关闭
    async startOrder(e) {
        console.log(e.currentTarget.dataset.id);
        console.log(e.detail.value.length);
        var data = {
            bool: e.detail.value.length,
            sid: e.currentTarget.dataset.id
        };
        const res = await $request({url: api.start_price, data: {data}, method: 'POST'});
        if (res.code == 0) {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            });
            return;
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            });
        }
        console.log(res)
    },

    cancelTap: function () {
        this.setData({
            modalShow: false,
            modal2Show: false,
        })
    },
    confirmTap: function (e) {
        var gameSetting = this.data.gameSetting;
        var time = e.detail.value.time;
        gameSetting.time = time;
        var game = 'gamelist[' + this.data.nowId + ']';
        this.setData({
            modalShow: false
        });
        if (e.detail.value.time) {
            this.setData({
                [game]: gameSetting
            });
        }
    },
    timesetTap: function (e) {
        var id = e.currentTarget.dataset.id;
        var gameSetting = this.data.gamelist[id];
        this.setData({
            modalShow: true,
            nowId: id,
            gameSetting: gameSetting
        });
    },

    //设置价格
    setpriceTap: function (e) {
        var id = e.currentTarget.dataset.id;
        var sid = e.currentTarget.dataset.sid;
        this.data.unit_id = id;
        this.data.sid = sid;

        var gameSetting = this.data.gamelist[id];
        this.setData({
            modal2Show: true,
            nowId: id,
            gameSetting: gameSetting
        });
    },

    //设置价格提交
    async priceTap(e) {
        // var gameSetting = this.data.gameSetting;
        var price = e.detail.value.price;
        // gameSetting.price = price;

        const session = Session.get()
        if (session) {
            let user_info = JSON.parse(session.userInfo)
            let data =
                {
                    price: price,
                    unit_id: this.data.unit_id,
                    sid: this.data.sid,
                    openid: user_info.openId
                }
            console.log(data)

            const res = await $request({url: api.skill_unit_price, data: data, method: 'POST'})

            if (res.code == 0) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                });
                return;
            }
            else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                });
            }
        }

        var game = 'gamelist[' + this.data.nowId + ']';
        this.setData({
            modal2Show: false
        });
        // if (e.detail.value.price && e.detail.value.price != '未设置') {
        //     this.setData({
        //         [game]: gameSetting
        //     });
        // }

        if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onLoad()
        }
    },

    startTakeOrder: function (e) {
        var lTime = e.detail.value.longTime;
        var pPrice = e.detail.value.price;
        var that = this;
        if (lTime > 0 && pPrice != '未设置' && this.data.onOff) {
            wx.showModal({
                title: '提示',
                content: '确定开始接单吗?',
                confirmColor: '#0362DC',
                success: function (res) {
                    if (res.confirm) {
                        wx.showToast({
                            title: '设计接单成功',
                            // icon:'none'
                        });
                        that.setData({
                            btnTxt: '接单中',
                            onOff: false
                        });
                    }
                    ;
                },
                fail: function (res) {
                },
                complete: function (res) {
                },
            })
        }
        if (lTime > 0 && pPrice != '未设置' && !this.data.onOff) {
            wx.showToast({
                title: '成功取消接单',
                icon: 'none'
            });
            that.setData({
                btnTxt: '开始接单',
                onOff: true
            });
        }
    },
    //获取最近一周订单数据
    async getWeekOrders() {
        var res = await $request({
            url: api.order_week,
            method: 'GET'
        });
        return res;
    },
    //获取用户订单评分总评分
    async getOrderRates() {
        var res = await $request({
            url: api.get_order_rate,
            method: 'GET'
        });
        return res;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        try {
            const session = Session.get()

            if (session) {
                let user_info = JSON.parse(session.userInfo)
                console.log(user_info)

                var res = await $request({url: api.user_skill_unit, data: {openid: user_info.openId}, method: 'POST'})
                console.log(JSON.parse(res.data))
                this.data.skillUnit = JSON.parse(res.data)

                var res = await this.getWeekOrders();
                var data = res.data;
                console.log(data);
                this.data.week.total = data.length;
                for (var i = 0; i < data.length; i++) {
                    this.data.week.amount += parseInt(data[i].total_price);
                }

                res = await this.getOrderRates();
                this.data.rate = res.data;
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