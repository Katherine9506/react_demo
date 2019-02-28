import {$init, $digest} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');
let util = require('../../utils/util.js');

// pages/indexBuyOrder/indexBuyOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        submitEnable: false,
        userPic: '/images/user1.jpg',
        userName: '罗哥',
        userSex: 0,  //性别 0为保密,1为男,2为女
        userAddress: '',
        userStar: 5,
        unitPrice: 59.89,
        total: 0,
        array: ['微信号', 'QQ', 'YY号'],
        contact_type: '微信号',
        index: 0,
        coupons: 0,
        num: 1
    },
    contactChange: function (e) {
        let type = e.detail.value;
        if (type == 0) {
            this.data.contact_type = '微信号';
        } else if (type == 1) {
            this.data.contact_type = 'QQ号码';
        } else {
            this.data.contact_type = 'YY号';
        }
        this.setData({
            index: e.detail.value
        });
    },
    releseTap: function () {
        var num = this.data.num;
        var unitPrice = this.data.unitPrice;
        var total;
        if (num > 1) {
            num--;
        } else {
            num = 1
        }
        ;
        total = parseFloat(unitPrice * num).toFixed(2);
        var needPay = parseFloat(unitPrice * num - this.data.coupons).toFixed(2);
        this.setData({
            num: num,
            total: total,
            needPay: needPay
        });
    },
    addTap: function () {
        var num = this.data.num;
        var unitPrice = this.data.unitPrice;
        var total;
        num++;
        total = parseFloat(unitPrice * num).toFixed(2);
        var needPay = parseFloat(unitPrice * num - this.data.coupons).toFixed(2);
        this.setData({
            num: num,
            total: total,
            needPay: needPay
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        try {
            const session = Session.get();

            if (session) {
                //提交订单页面信息
                const res = await $request({url: api.order_price, data: {pid: options.pid}, method: 'POST'});
                let order_price = JSON.parse(res.data)
                this.data.order_price = order_price;
                this.data.user_info = order_price.user_info;
                this.data.unitPrice = order_price.price;
                this.data.pid = options.pid;

                var unitPrice = this.data.unitPrice;
                var num = this.data.num;
                var total = 0;
                var total = parseFloat(unitPrice * num).toFixed(2);
                var needPay = parseFloat(unitPrice * num - this.data.coupons).toFixed(2);
                this.setData({
                    total: total,
                    needPay: needPay
                });

                console.log(order_price);

                $digest(this)
            }
        }
        catch (err) {
            console.log("+++2+++ error:", err)
        }
    },

    //提交订单
    async formSubmit(e) {
        this.setData({submitEnable: true});

        let form_id = e.detail.formId;
        await util.getFormIds(form_id);

        console.log(form_id);
        if (e.detail.value.contact == '') {
            wx.showModal({
                title: '提醒',
                showCancel: false,
                content: '请填写联系方式！',
                success: function (res) {

                },
            });
            this.setData({submitEnable: false});
            return;
        }
        let data = {
            price_id: this.data.pid,
            form_id: form_id,
            count: this.data.num,
            contact_type: this.data.contact_type,
            contact: e.detail.value.contact,
            total_price: this.data.total,
            pay_total: this.data.needPay,
            remark: e.detail.value.remark
        };

        //请求接口添加订单
        const res = await $request({url: api.order_create, data: {data}, method: 'POST'});
        let order_id = JSON.parse(res.data);
        console.log('订单添加提示结果：', JSON.parse(res.data));
        if (order_id) {
            //订单添加成功逻辑,支付订单
            this.payOrder(order_id)
            console.log('success')
        } else {
            //订单添加失败逻辑
            console.log('fail')
            wx.showModal({
                title: '提醒',
                showCancel: false,
                content: '服务器出错了，请稍后重试！',
                success: function (res) {

                },
            });
            this.setData({submitEnable: false});
            return;
        }
    },

    //支付
    async payOrder(order_id) {
        const res = await $request({url: api.order_pay, data: {id: order_id}, method: 'POST'})
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
                    // url: '/pages/indexPay/indexPay',
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
                            // url: '/pages/indexPay/indexPay',
                            url: '/pages/mineOrderDetail/mineOrderDetail?id=' + order_id,
                        })
                    }
                })
            }
        });
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