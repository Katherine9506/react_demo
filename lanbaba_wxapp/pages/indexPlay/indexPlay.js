// pages/indexPlay/indexPlay.js
import {$digest, $init} from '../../lib/page.data'
import {$request} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module');
const app = getApp();
let api = require('../../utils/api.js');
let timer = null;
let rotateTimer = 0;
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
        playTotalSeconds: 0,//总秒数
        currentPlaySeconds: 0,//当前秒数
        secondsString: "00:00:00",
        /* 图片旋转 */
        rotateIndex: 0,
        animationData: {},
        animation: null,
    },
    //音乐播放|暂停控制
    playTap: function () {
        this.setData({
            status: !this.data.status
        });
        app.switchPlayStatus();
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
        app.switchAppMusic(index);
        this.closeModelTap();
    },
    /* 切换播放类型--单曲循环--列表循环 */
    switchPlayType: function (e) {
        if (this.data.audioCycling) {
            /* 循环播放 */
            wx.showToast({icon: 'none', title: '单曲循环模式'});
        } else {
            /* 单曲循环 */
            wx.showToast({icon: 'none', title: '列表循环模式'});
        }
        this.setData({
            audioCycling: !this.data.audioCycling,
        });
        app.globalData.audioCycling = this.data.audioCycling;
    },
    /* 切换到上一首 */
    switchPrevAudio: function () {
        app.switchPrevAudio();
    },
    /* 切换到下一首 */
    switchNextAudio: function () {
        app.switchNextAudio();
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
    /* 图片旋转 */
    rotateAudioThumb() {
        var that = this;
        if (!rotateTimer) {
            rotateTimer = setInterval(function () {
                that.data.rotateIndex = that.data.rotateIndex + 1;
                that.animation.rotate(that.data.rotateIndex).step();
                that.setData({
                    animationData: that.animation.export()
                })
            }, 100);
        }
    },
    /* 停止旋转 */
    stopRotate() {
        if (rotateTimer) {
            clearInterval(rotateTimer);
            rotateTimer = 0;
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        console.log('IndexPlay page OnLoad');
        var that = this;
        $init(that);

        if (options.hasOwnProperty('audio_title')) {
            wx.setNavigationBarTitle({
                title: options.audio_title
            });
        }

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
        this.data.currentAudio = app.globalData.audioCycles[app.globalData.currentIndex];
        this.data.currentIndex = app.globalData.currentIndex;
        app.globalData.appMusic = this.data.currentAudio;
        app.globalData.currentIndex = this.data.currentIndex;

        if (!app.globalData.userInfo.hasOwnProperty('is_member')) {
            var res = await this.getUserDetail();
            app.globalData.userInfo['is_member'] = res.data.is_member;
        }
        this.data.member = app.globalData.userInfo.is_member;

        this.animation = wx.createAnimation({
            duration: 100,
            timingFunction: 'Linear'
        });

        timer = setInterval(that.createTimer, 200);

        $digest(that);
    },
    createTimer() {
        var that = this;
        that.setData({
            playTotalSeconds: app.globalData.playTotalSeconds,
            currentPlaySeconds: app.globalData.currentPlaySeconds,
            secondsString: app.globalData.secondsString,

            status: app.globalData.appMusicStatus,
            currentAudio: app.globalData.appMusic,
            currentIndex: app.globalData.currentIndex,
            audioCycling: app.globalData.audioCycling,
        });
        /* 检测 音频收费且用户非会员 */
        if (that.data.currentAudio.is_vip && !that.data.member) {
            clearInterval(timer);
            clearInterval(rotateTimer);
            app.globalData.innerAudioContext.stop();
            app.showModal('抱歉，您还不是会员，不能播放会员音频。点击"知道了"将切换下一首^_^', function () {
                timer = setInterval(that.createTimer, 200);
                that.switchNextAudio();
                console.log(' 检测 音频收费且用户非会员 ');
            });
        }
        /* 监听音频播放 旋转图片 */
        if (that.data.status) {
            that.rotateAudioThumb();
        } else {
            that.stopRotate();
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log('IndexPlay page onReady: app.globalData.appMusic', app.globalData.appMusic);
        var innerAudioContext = app.prepareInnerAudioContext();
        /* 设置音频文件 */
        if (innerAudioContext.src != this.data._host + app.globalData.appMusic.audio) {
            app.prepareForBGM();
            innerAudioContext.src = this.data._host + app.globalData.appMusic.audio;
            /* 设置自动播放 */
            innerAudioContext.autoplay = true;
            /* 正在播放 */
            this.setData({
                status: true
            });
        } else if (!app.globalData.appMusicStatus) {
            if (app.globalData.stopped) {
                innerAudioContext.src = api.host + app.globalData.appMusic.audio;
            }
            app.globalData.appMusicStatus = true;
            innerAudioContext.play();
        }
        this.setData({
            status: true
        });
    },
    /* 更新播放事件 拖动滑块 当前秒数:e.detail.value */
    sliderDragHandler: function (e) {
        app.globalData.innerAudioContext.seek(e.detail.value);
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
        clearInterval(timer);
        this.stopRotate();
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
});