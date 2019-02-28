import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');

// pages/indexBuy/indexBuy.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _wxapp: api.oss_domain + '/upload/wxapp',
        bannerUrl: [],
        current: 0,
        bannerList: 0,
        voiceSrc: '/images/mmcs.mp3',
        onOff: true,
        skills: [],
        evaluation: [],
        page: 0,
    },
    userSkillDetailNav: function (e) {
        let id = e.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
            url: '/pages/indexBuy/indexBuy?id=' + id + '&user_id=' + this.data.user_id
        })
    },
    contactTap: function (e) {
        if (this.data.user_info.id == this.data.user_id) {
            wx.showToast({
                title: '不要联系自己啦',
                icon: 'none'
            });
            return false;
        }
        wx.navigateTo({
            url: '/pages/msgDetail/msgDetail?chater_id=' + this.data.user_info.id + '&user_id=' + this.data.user_id
            + '&chater_name=' + this.data.user_info.name + '&chater_thumb=' + this.data.user_info.thumb,
        })
    },
    audioPlay: function (e) {
        console.log(this.data.user_info.audio);
        if (this.data.onOff) {
            this.audioCtx.play();
            this.data.onOff = !this.data.onOff;
        } else {
            this.audioCtx.pause();
            this.data.onOff = !this.data.onOff;
        }
        this.setData({onOff: this.data.onOff});
    },
    bannerChange: function (e) {
        console.log(e.detail.current);
        this.setData({
            current: e.detail.current
        })
    },
    buyNow: function () {
        if (this.data.user_info.id == this.data.user_id) {
            wx.showToast({
                title: '您给自己下单干甚么-_-|||',
                icon: 'none'
            });
            return false;
        }
        wx.navigateTo({
            url: '/pages/indexBuyOrder/indexBuyOrder?pid=' + this.data.price_detail.id,
        })
    },
    shareBtn: function () {
        var that = this;
        wx.showShareMenu({
            success: function (res) {
                console.log(1, res);
                that.onShareAppMessage();
            },
            fail: function () {
                console.log(2);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);
        this.data.user_id = options.user_id;
        try {
            const session = Session.get();

            if (session) {
                //获取价格详情信息
                const res = await $request({url: api.price_detail, data: {id: options.id}, method: 'POST'});
                let price_detail = JSON.parse(res.data);
                this.data.user_info = price_detail.user_info;
                this.data.price_detail = price_detail.price_detail;
                this.data.skill = price_detail.skill;
                this.data.bannerUrl = price_detail.user_info.images;
                this.data.bannerList = this.data.bannerUrl.length;

                console.log(price_detail);

                let prices = await $request({
                    url: api.get_user_skills,
                    data: {user_id: this.data.user_info.id, exclude_sid: this.data.price_detail.sid}
                });
                prices = prices.data;
                this.data.prices = prices;

                const evaluate_res = await $request({
                    url: api.evaluate_list,
                    data: {uid: price_detail.user_info.id, page: this.data.page, sid: price_detail.price_detail.sid},
                    method: 'POST'
                });
                let evaluate = JSON.parse(evaluate_res.data);
                this.data.evaluate_total = evaluate.total;
                this.data.evaluation = evaluate.data;
                console.log(evaluate);

                wx.setNavigationBarTitle({
                    title: this.data.user_info.name
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
        this.audioCtx = wx.createAudioContext('voice');
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
        return {
            title: '嗨狗电竞邀请您一起来玩游戏，大批陪玩师等候您'
        }
    }
});