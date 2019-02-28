//index.js
import {$digest, $init} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'
import {getTodayDate} from '../../utils/util'

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module');
const app = getApp();
let api = require('../../utils/api.js');
let timer = 0;
Page({
    data: {
        _host: api.host,
        motto: 'Hello World',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        name: '此时此刻',
        pic: '',
        author: '许巍',
        src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        indicatorC: 'rgba(255,255,255,0.5)',
        indicatorAC: 'rgba(59,144,243,1)',
        autoplay: true,
        circular: true,
        phoneBind: false,
        loading: true
    },
    searchTap: function () {
        wx.navigateTo({
            url: '/pages/indexSearch/indexSearch',
        })
    },
    /* 更多 */
    moreTap: function (e) {
        wx.navigateTo({
            url: '/pages/indexMore/indexMore?album_category_id=' + e.currentTarget.dataset.id +
                "&album_category_name=" + e.currentTarget.dataset.title,
        })
    },
    /* 专辑详情 */
    albumDetail: function (e) {
        var album_id = e.currentTarget.dataset.id;
        var album_is_vip = e.currentTarget.dataset.is_vip;
        var album_title = e.currentTarget.dataset.title;
        if (!this.data.userInfo.phone) {
            wx.navigateTo({
                url: '/pages/phone/phone?album_id=' + album_id + '&album_is_vip=' + album_is_vip + "&album_title=" + album_title,
            });
            return false;
        }
        if (album_is_vip) {
            wx.navigateTo({
                url: '/pages/indexList/indexList?album_id=' + album_id + "&album_title=" + album_title,
            });
            return false;
        } else {
            wx.navigateTo({
                url: '/pages/indexList2/indexList2?album_id=' + album_id + "&album_title=" + album_title,
            });
            return false;
        }
    },
    /* 轮播图列表 */
    async getSlides() {
        var res = await $request({url: api.slides});//默认为GET
        return res;
    },
    /* 专辑标签列表 */
    async getAlbumTags() {
        var res = await $request({url: api.album_tags,});
        return res;
    },
    /* 专辑分类列表 */
    async getAlbumCategories() {
        var res = $request({url: api.album_categories_with_album});
        return res;
    },
    /* 上一首 */
    switchPrevAudio(e) {
        app.switchPrevAudio();
    },
    /* 下一首 */
    switchNextAudio(e) {
        app.switchNextAudio();
    },
    /* 切换播放状态 */
    switchPlayStatus(e) {
        this.setData({
            status: !this.data.status,
        });
        app.switchPlayStatus();
    },
    /* 跳转到音频播放页 */
    navigateToAudioDetail(e) {
        wx.navigateTo({
            url: '/pages/indexPlay/indexPlay?audio_title=' + e.currentTarget.dataset.title
        })
    },
    async onLoad() {
        $init(this);

        var that = this;
        wx.showLoading({
            title: '数据加载中',
            mask: true,
            success(res) {
                that.setData({
                    loading: true
                });
            }
        });
        const session = Session.get();
        if (session) {
            const login_res = await $request({url: api.is_login, method: 'GET'});
            if (login_res.data.status) {
                this.data.userInfo = session.userInfo;
                this.data.hasUserInfo = true;
                app.globalData.userInfo = session.userInfo;
                app.globalData.hasUserInfo = true;
            } else {
                console.log('未登录，清除缓存');
                Session.clear();
            }
        } else {
            const userInfo = await $login();
            this.data.userInfo = userInfo;
            this.data.hasUserInfo = true;
            app.globalData.userInfo = userInfo;
            app.globalData.hasUserInfo = true;
        }

        if (this.data.userInfo.hasOwnProperty('phone') && this.data.userInfo.phone) {
            this.data.phoneBind = true;
        }
        console.log('Index Page Onload:', this.data.userInfo);

        var res = await this.getSlides();
        this.data.slides = res.data;

        res = await this.getAlbumTags();
        this.data.albumTags = res.data;

        res = await this.getAlbumCategories();
        this.data.albumCategories = res.data;

        wx.hideLoading({
            success(res) {
                that.setData({
                    loading: false
                })
            }
        });

        $digest(this);
    },
    createTimer() {
        var that = this;
        that.setData({
            secondsString: app.globalData.secondsString,
            status: app.globalData.appMusicStatus,
            currentAudio: app.globalData.appMusic,
            hasAppMusic: app.globalData.appMusic ? true : false,
        });
        /* 检测 音频收费且用户非会员 */
        if (that.data.currentAudio && that.data.currentAudio.is_vip && !app.globalData.userInfo.member) {
            clearInterval(timer);
            app.globalData.innerAudioContext.stop();
            app.showModal('抱歉，您还不是会员，不能播放会员音频。点击"知道了"将切换下一首^_^', function () {
                timer = setInterval(that.createTimer, 200);
                that.switchNextAudio();
            });
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        var that = this;
        /* 定时器 */
        timer = setInterval(that.createTimer, 200);
    },
    /* 检查会员状态 */
    async checkMemberValid() {
        var res = await
            $request({
                url: api.user_check_member_valid,
                data: {uuid: app.globalData.userInfo.id}
            });
        console.log('检查会员状态');
        console.log(res);
        return res;
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    async onHide() {
        console.log('Index OnHide execute.');
        clearInterval(timer);

        var today = getTodayDate(new Date());
        /* 检查会员过期------start */
        if (app.globalData.hasUserInfo) {
            if (!app.globalData.memberCheckDate || app.globalData.memberCheckDate != today) {
                app.globalData.memberCheckDate = today;
                app.globalData.todayMemberCheck = false;
            }
            if (!app.globalData.todayMemberCheck) {
                var res = await this.checkMemberValid();
                if (res.code == 200) {
                    app.globalData.todayMemberCheck = true;
                    var old_is_member = app.globalData.userInfo['is_member'];
                    var is_member = res.data.is_member;
                    var session = Session.get();
                    session.userInfo['is_member'] = is_member;
                    session.userInfo['expire_date'] = res.data.expire_date;
                    Session.set(session);
                    app.globalData.userInfo['is_member'] = is_member;
                    app.globalData.userInfo['expire_date'] = res.data.expire_date;
                    console.log(app.globalData);
                    if (old_is_member) {
                        wx.showModal({
                            title: '温馨提示',
                            cancelText: '知道了',
                            confirmText: '前往续费',
                            content: '会员已过期!',
                            success(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/indexMbOpen/indexMbOpen',
                                    })
                                }
                            }
                        });
                    }
                } else {
                    wx.showToast({icon: 'none', title: res.msg});
                }
            }
        }
        /* 检查会员过期------end */
    },
});
