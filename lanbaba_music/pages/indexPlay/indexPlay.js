// pages/indexPlay/indexPlay.js
import {$digest, $init} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module');
const app = getApp();
let api = require('../../utils/api.js');
let timer = null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        _host: api.host,
        audioPercent: 0,//歌曲播放进度
        switchBoxH: 0,
        member: false,
        modelSh: false,
        status: false,//播放|暂停|结束
        currentAudio: {},
        audioCycling: true,
    },
    //音乐播放|暂停
    playTap: function () {
        var status = this.data.status;

        this.setData({
            status: !status
        });
        if (!status) {
            this.audioCtx.play();
        } else {
            this.audioCtx.pause();
        }
    },
    //音频播放进度改变时触发事件
    audioTimeUpdateHandler: function (e) {
        this.data.audioPercent = Math.round(e.detail.currentTime / e.detail.duration * 100);
        this.setData({audioPercent: this.data.audioPercent});
    },
    // 歌曲播放到末尾触发事件
    audioEndHandler: function (e) {
        // 循环播放
        var index = 0;
        if (this.data.audioCycling) {
            if (app.globalData.audioIndex !== app.globalData.audioCycles.length - 1) {
                index = app.globalData.currentIndex + 1;
            }
        } else {
            index = this.data.currentIndex;
        }

        this.setData({
            currentAudio: this.data.audioCycles[index],
            audioPercent: 0,
            status: true,
            currentIndex: index
        });

        var that = this;
        /* 音频收费且用户非会员 */
        if (this.data.currentAudio.is_vip && !this.data.member) {
            that.showModal('抱歉，您还不是会员，不能播放会员音频。点击"知道了"将切换下一首^_^', function () {
                that.switchNextAudio();
            });
        } else {
            this.audioCtx.play();
        }
    },
    // 显示循环列表
    modelShowTap: function (e) {
        this.setData({
            modelSh: true
        });
    },
    // 关闭循环列表
    closeModelTap: function () {
        this.setData({
            modelSh: false
        });
    },
    // 手动切换歌曲
    switchAudio: function (e) {
        var index = e.currentTarget.dataset.index;
        if (index === app.globalData.currentIndex) {
            wx.showToast({icon: 'none', title: '音频正在播放'});
            return false;
        }
        app.globalData.audioIndex = index;
        this.setData({
            currentAudio: app.globalData.audioCycles[index],
            audioPercent: 0,
            status: true,
            currentIndex: index,
        });
        this.audioCtx.setSrc(this.data._host + this.data.currentAudio.audio);

        var that = this;
        /* 音频收费且用户非会员 */
        if (this.data.currentAudio.is_vip && !this.data.member) {
            that.showModal('抱歉，您还不是会员，不能播放会员音频。点击"知道了"将切换下一首^_^', function () {
                that.switchNextAudio();
            });
        } else {
            this.audioCtx.play();
        }
        this.closeModelTap();
    },
    /* 切换播放类型 */
    switchPlayType: function (e) {
        if (this.data.audioCycling) {
            /* 循环播放 */
            wx.showToast({icon: 'none', title: '切换到单曲循环模式'});
        } else {
            /* 单曲循环 */
            wx.showToast({icon: 'none', title: '切换到循环播放模式'});
        }
        this.setData({
            audioCycling: !this.data.audioCycling,
        });
    },
    /* 切换到上一首 */
    switchPrevAudio: function () {
        var index = app.globalData.audioCycles.length - 1;
        if (this.data.currentIndex !== 0) {
            index = this.data.currentIndex - 1;
        }
        this.setData({
            currentAudio: this.data.audioCycles[index],
            audioPercent: 0,
            status: true,
            currentIndex: index
        });
        this.audioCtx.setSrc(this.data._host + this.data.currentAudio.audio);

        var that = this;
        /* 音频收费且用户非会员 */
        if (this.data.currentAudio.is_vip && !this.data.member) {
            that.showModal('抱歉，您还不是会员，不能播放会员音频。点击"知道了"将切换上一首^_^', function () {
                that.switchPrevAudio();
            });
        } else {
            this.audioCtx.play();
        }
    },
    /* 切换到下一首 */
    switchNextAudio: function () {
        var index = 0;
        if (this.data.currentIndex !== this.data.audioCycles.length - 1) {
            index = this.data.currentIndex + 1;
        }
        this.setData({
            currentAudio: this.data.audioCycles[index],
            audioPercent: 0,
            status: true,
            currentIndex: index
        });
        this.audioCtx.setSrc(this.data._host + this.data.currentAudio.audio);

        var that = this;
        /* 音频收费且用户非会员 */
        if (that.data.currentAudio.is_vip && !that.data.member) {
            that.showModal('抱歉，您还不是会员，不能播放会员音频。点击"知道了"将切换下一首^_^', function () {
                that.switchNextAudio();
            });
        } else {
            that.audioCtx.play();
        }
    },
    showModal: function (content, callback = null) {
        wx.showModal({
            title: '温馨提示',
            content: content,
            cancelText: '知道了',
            confirmText: '开通会员',
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({url: '/pages/indexMbOpen/indexMbOpen'});
                } else {
                    callback && callback();
                }
            }
        });
    },
    /* 开通会员 */
    buyMember: function () {
        wx.navigateTo({url: '/pages/indexMbOpen/indexMbOpen'});
    },
    /* 检测用户会员状态 */
    async getUserDetail() {
        var res = await $request({
            url: api.user_detail,
            data: {uuid: app.globalData.userInfo.id}
        });
        console.log(res);
        return res;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        var that = this;
        $init(that);

        wx.getSystemInfo({
            success: function (res) {
                var clientH = res.windowHeight,
                    clientW = res.windowWidth,
                    rpxR = 750 / clientW;
                var calcH = clientH * rpxR - 330;
                that.setData({
                    switchBoxH: calcH
                });
            },
        });

        this.data.audioCycles = app.globalData.audioCycles;
        this.data.currentAudio = app.globalData.audioCycles[app.globalData.audioIndex];
        this.data.currentIndex = app.globalData.audioIndex;

        if (!app.globalData.userInfo.hasOwnProperty('is_member')) {
            var res = await this.getUserDetail();
            app.globalData.userInfo['is_member'] = res.data.is_member;
        }
        this.data.member = app.globalData.userInfo.is_member;

        $digest(that);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.audioCtx = wx.createAudioContext('myaudio');
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