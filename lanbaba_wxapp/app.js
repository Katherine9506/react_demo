//app.js

import {sec_to_time} from 'utils/util'
import {setLoginUrl} from './lib/page.auth'

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('./lib/regenerator/runtime-module');

let api = require('/utils/api');

App({
    globalData: {
        userInfo: null,//{avatarUrl,city,country,gender,language,nickName,province}
        hasUserInfo: false,

        todayMemberCheck: false,//当日检查会员状态
        memberCheckDate: null,//会员状态检查日期

        /* 播放歌曲时 循环列表 */
        audioCycles: [],
        audioCycling: true,
        appMusic: null,//当前正在播放的歌曲 src=>audio
        innerAudioContext: null,//InnerAudioContext实例
        appMusicStatus: false,//音频状态 播放|暂停|停止
        onPlayTimer: null,//音频播放监听，开启定时器
        secondsString: "00:00",//播放时间字符串
        playTotalSeconds: 0,
        currentPlaySeconds: 0,
        currentIndex: 0,
        stopped: false,
    },
    /* 准备工作 背景音频的显示 */
    prepareForBGM() {
        var innerAudioContext = this.globalData.innerAudioContext;
        var currentMusic = this.globalData.appMusic;
        innerAudioContext.title = currentMusic.title;
        innerAudioContext.singer = '蓝爸爸讲故事';
        innerAudioContext.coverImgUrl = api.host + currentMusic.thumb;
    },
    /* 切换歌曲 */
    switchAppMusic(index, onEnded = false) {
        if (index === this.globalData.currentIndex && !onEnded) {
            wx.showToast({icon: 'none', title: '音频正在播放'});
            return false;
        }
        this.globalData.currentIndex = index;
        this.globalData.appMusic = this.globalData.audioCycles[index];
        this.globalData.appMusicStatus = true;
        console.log('当前音频：', this.globalData.appMusic.title + this.globalData.appMusic.audio);
        this.prepareForBGM();
        this.globalData.innerAudioContext.src = api.host + this.globalData.appMusic.audio;
        this.globalData.innerAudioContext.play();
    },
    /* 准备音频管理器 返回管理器实例 */
    prepareInnerAudioContext: function () {
        if (!this.globalData.innerAudioContext) {
            // this.globalData.innerAudioContext = wx.createInnerAudioContext();
            this.globalData.innerAudioContext = wx.getBackgroundAudioManager();
        }
        if (!this.globalData.audioCycling) {
            this.globalData.innerAudioContext.loop = true;//单曲循环
        }

        var that = this;
        var innerAudioContext = this.globalData.innerAudioContext;
        /* 注册音频事件 */
        innerAudioContext.onWaiting(function () {
            wx.showLoading({
                title: '加载中',
                mask: true
            });
        });
        innerAudioContext.onPlay(function () {
            console.log('开始监听音频播放事件：');
            wx.hideLoading();
            that.globalData.appMusicStatus = true;
            that.updatePlayTime();
        });
        innerAudioContext.onPause(function () {
            console.log('开始监听音频暂停事件');
            that.globalData.appMusicStatus = false;
        });
        innerAudioContext.onStop(function () {
            console.log('监听音频停止事件');
            console.log(innerAudioContext);
            that.globalData.stopped = true;
            that.globalData.appMusicStatus = false;
        });
        innerAudioContext.onSeeked(function () {
            console.log('OnSeeked');
            that.updatePlayTime();
        });
        innerAudioContext.onEnded(function () {
            that.onAudioEnded();
        });
        /* 仅支持IOS */
        innerAudioContext.onNext(function () {
            that.switchNextAudio();
        });
        /* 仅支持IOS */
        innerAudioContext.onPrev(function () {
            that.switchPrevAudio();
        });

        return innerAudioContext;
    },
    /* 音频自然播放结束 */
    onAudioEnded() {
        console.log('OnEnded');
        var that = this;
        that.globalData.appMusicStatus = false;
        var index = 0;
        if (that.globalData.audioCycling) {
            if (that.globalData.currentIndex !== that.globalData.audioCycles.length - 1) {
                index = that.globalData.currentIndex + 1;
            }
        } else {
            index = that.globalData.currentIndex;
        }
        that.switchAppMusic(index, true);
    },
    /* 下一首 */
    switchNextAudio() {
        var that = this;
        var index = 0;
        if (that.globalData.currentIndex !== that.globalData.audioCycles.length - 1) {
            index = that.globalData.currentIndex + 1;
        }
        that.switchAppMusic(index);
    },
    /* 上一首 */
    switchPrevAudio() {
        var that = this;
        var index = that.globalData.audioCycles.length - 1;
        if (that.globalData.currentIndex !== 0) {
            index = that.globalData.currentIndex - 1;
        }
        that.switchAppMusic(index);
    },
    /* 切换播放状态 */
    switchPlayStatus() {
        var status = this.globalData.appMusicStatus;
        this.globalData.appMusicStatus = !status;
        if (status) {
            this.globalData.innerAudioContext.pause();
        } else {
            if (this.globalData.stopped) {
                this.globalData.innerAudioContext.src = api.host + this.globalData.appMusic.audio;
                console.log('switch play status: ', this.globalData.innerAudioContext.src);
            }
            this.globalData.innerAudioContext.play();
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
    /* 更新播放时间字符串 */
    updatePlayTime() {
        var that = this;
        var innerAudioContext = that.globalData.innerAudioContext;
        innerAudioContext.onTimeUpdate(function () {
            that.globalData.playTotalSeconds = innerAudioContext.duration.toFixed(2);
            that.globalData.currentPlaySeconds = innerAudioContext.currentTime.toFixed(2);
            that.globalData.secondsString = sec_to_time(that.globalData.currentPlaySeconds);
        });
    },
    onLaunch: function () {
        /* 设置登录URL */
        setLoginUrl(api.login);

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        });
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo;

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
});