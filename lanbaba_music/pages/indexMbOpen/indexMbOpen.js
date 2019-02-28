// pages/indexList/indexList.js
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
        heightRpx: '',
        // tabId: 1,
        member_index: 0,
    },
    /* 选择会员套餐 */
    async memberTap(e) {
        var that = this;
        that.setData({
            member_index: e.detail.value
        });
        var currentMember = that.data.memberTypes[that.data.member_index];
        /* 生成订单 */
        wx.showModal({
            title: '提示',
            content: `您选择了会员套餐：${currentMember.desc}`,
            cancelText: '我再想想',
            confirmText: '立即支付',
            success(res) {
                console.log('选择了会员套餐' + currentMember.id);
                if (res.confirm) {
                    that.orderGenerate(currentMember.id);
                }
            }
        });
    },
    /* 生成订单 */
    async orderGenerate(member_id) {
        var res = await $request({
            url: api.order_create,
            data: {uuid: app.globalData.userInfo.id, member_id: member_id},
            method: 'POST'
        });
        console.log(res);
        if (res.code == 500) {
            wx.showToast({icon: 'none', title: '服务器出错了，请稍后重试！'});
            return false;
        }
        if (res.code == 200) {
            await this.payOrder(res.data.id);
            console.log('订单支付成功');
        }
    },
    /* 订单支付 */
    async payOrder(order_id) {
        var res = await $request({
            url: api.order_pay,
            data: {uuid: app.globalData.userInfo.id, order_id: order_id},
            method: 'POST',
        });
        console.log('订单支付打印信息：', res.data);
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
    /* 获得会员套餐列表 */
    async getMembers() {
        var res = await $request({
            url: api.members
        });
        console.log(res);
        return res;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.log(res.windowHeight);
                var clientH = res.windowHeight,
                    clientW = res.windowWidth,
                    rpxR = 750 / clientW;
                var calcH = clientH * rpxR - 98;
                that.setData({
                    heightRpx: calcH
                })
            },
        });

        var res = await this.getMembers();
        this.data.memberTypes = res.data;

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
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})