import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');

// pages/playEvaluateDetail/playEvaluateDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        submitEnable: false,
        anony: 0,
        star: 0
    },
    changeStar: function (e) {
        console.log(e.target.dataset.id);
        var id = e.target.dataset.id;
        this.setData({
            star: id
        });
    },

    async formSubmit(e) {
        var that = this;
        that.setData({submitEnable: true});

        let data = {
            order_id: that.data.order_id,
            boss_uid: that.data.boss_uid,
            play_uid: that.data.play_uid,
            is_anony: that.data.anony,
            score: that.data.star,
            content: e.detail.value.content
        };
        console.log(data);

        const res = await $request({url: api.evaluate_submit, data: {data: data}, method: 'POST'});

        if (res.code == 1) {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '订单评价成功！',
                success: function (res) {
                    //返回上一页
                    setTimeout(function () {
                        var pages = getCurrentPages(); // 当前页面
                        var beforePage = pages[pages.length - 2]; // 前一个页面
                        wx.navigateBack({
                            success: function () {
                                beforePage.commented(that.data.index); // 执行前一个页面的onLoad方法
                            }
                        });
                    }, 1000)
                }
            })
        }
        else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '服务器不在状态，请稍后再试！',
                success: function (res) {

                }
            });
            that.setData({submitEnable: false});
        }
        // wx.navigateTo({
        //     url: '/pages/playFinishEvaluate/playFinishEvaluate',
        // })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);
        let order_id = options.order_id;
        this.data.order_id = order_id;
        this.data.name = options.name;
        this.data.thumb = options.thumb;
        this.data.index = options.index;
        console.log(this.data.index);

        try {
            const session = Session.get()

            if (session) {
                //获取订单列表
                const res = await $request({url: api.order_detail, data: {id: order_id}, method: 'POST'})
                let order = JSON.parse(res.data)
                this.data.boss_uid = order.boss_uid;
                this.data.play_uid = order.play_uid;
                // this.data.order_list = order_list.data;
                console.log(order)

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

    },

    anonyTab(e) {
        if (e.detail.value[0]) {
            this.data.anony = 1;
        }
        else {
            this.data.anony = 0;
        }
        console.log(this.data.anony)
    }
})