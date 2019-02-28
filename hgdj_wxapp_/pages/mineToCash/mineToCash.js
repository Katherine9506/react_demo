// pages/mineToCash/mineToCash.js
import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
const app = getApp();
//获取应用实例
let api = require('../../utils/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        amount: 0,
        withdraw: 0,//提现金额,计算得到
        withdrawWithInterest: 0,
        alipay_account: '',//支付宝账号
        alipay_name: '',//支付宝账户提现真实姓名
        playList: [],
        playListInit: [],
        withdrawAll: false,//提现全部选项
        interest: 0.1,//提现手续费
        floor: 1,//提现门槛
        group: '测试分组'
    },
    //加载用户可提取金额的订单
    async getWithdrawableOrders() {
        var res = await $request({
            url: api.play_list,
            method: 'GET',
        });
        return JSON.parse(res.data);
    },
    //取消某一项可提现
    cancelWithdraw: function (e) {
        let dataset = e.currentTarget.dataset;
        let index = dataset.id;
        let price = dataset.price;
        this.data.playList.splice(index, 1);
        //改变总金额
        this.setData({
            withdraw: this.data.withdraw - price,
            playList: this.data.playList,
            withdrawAll: false
        });
        console.log('withdraw:', this.data.withdraw);
        if (this.data.withdraw < 1) {
            this.setData({withdrawWithInterest: 0});
        } else {
            this.setData({withdrawWithInterest: Math.round(this.data.withdraw * (1 - this.data.interest) * 100) / 100});
        }
        console.log(this.data.withdrawWithInterest);
    },
    groupBlurHandler: function (e) {
        this.setData({
            group: e.detail.value
        });
    },
    accountBlurHandler: function (e) {
        this.setData({
            alipay_account: e.detail.value
        });
    },
    nameBlurHandler: function (e) {
        this.setData({
            alipay_name: e.detail.value
        })
    },
    //提现全部
    withdrawAll: function (e) {
        this.setData({
            withdrawAll: true,
            playList: this.data.playListInit,
            withdraw: this.data.amount,
        });
        if (this.data.amount < 1) {
            this.setData({withdrawWithInterest: 0});
        } else {
            this.setData({withdrawWithInterest: Math.round(this.data.amount * (1 - this.data.interest) * 100) / 100});
        }
    },
    toast: function (title, duration) {
        wx.showToast({
            title: title,
            icon: 'none',
            duration: 2000
        });
    },
    trim: function (str) {
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    },
    cancelTap: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    withdrawBlur: function (e) {
        this.data.withdraw = e.detail.value;
    },
    //发起提现
    async confirmTap(e) {
        if (this.data.amount == 0) {
            this.toast('当前可提现金额为0，不能发起提现');
            return false;
        }
        if (this.data.withdraw == 0) {
            this.toast('您未选择任何可提现的订单');
            return false;
        }
        if (this.data.withdraw < this.data.floor) {
            this.toast('提现金额最少为' + this.data.floor + '元!');
            return false;
        }
        if (this.data.withdrawWithInterest > Math.round(this.data.amount * (1 - this.data.interest) * 100) / 100) {
            this.toast('提现金额不可大于' + Math.round(this.data.amount * (1 - this.data.interest) * 100) / 100 + '可提现金额');
            return false;
        }
        var res = await $request({
            url: api.withdraw,
            method: 'POST',
            data: {
                'plays': this.data.playList,
                'withdraw': this.data.withdraw,
                'withdrawWithInterest': this.data.withdrawWithInterest,
                'account': this.trim(this.data.alipay_account),
                'name': this.trim(this.data.alipay_name),
                'group': this.trim(this.data.group)
            }
        });
        console.log(res);
        this.toast(res.msg);
        if (res.code == 1) {
            /* 更新用户本地余额 */
            app.globalData.user.balance = Math.round(app.globalData.user.balance * 100 - this.data.withdraw * 100) / 100;
            var session = Session.get();
            this.data.userInfo.balance = Math.round(this.data.userInfo.balance * 100 - this.data.withdraw * 100) / 100;
            session.userInfo = JSON.stringify(this.data.userInfo);
            Session.set(session);
            //转向用户提现列表
            wx.redirectTo({url: '/pages/mineChange/mineChange?type=withdraw'});
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        try {
            const session = Session.get();
            if (session) {
                this.data.userInfo = session.userInfo;
                this.data.userInfo = JSON.parse(this.data.userInfo);

                var playList = await this.getWithdrawableOrders();
                this.data.playList = playList;
                this.data.playListInit = playList;

                var amount = 0;
                for (var i = 0; i < playList.length; i++) {
                    amount += parseFloat(playList[i].total_price) * 100;
                }
                amount /= 100;
                this.data.amount = amount;
                this.data.withdraw = amount;
                if (this.data.amount < 1) {
                    this.data.withdrawWithInterest = 0;
                } else {
                    this.data.withdrawWithInterest = Math.round(this.data.amount * (1 - this.data.interest) * 100) / 100;
                }

                $digest(this);
            }
        } catch (e) {
            console.log('##############error log:', e);
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