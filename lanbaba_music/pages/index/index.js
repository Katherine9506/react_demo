//index.js
import {$digest, $init} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'
import {getTodayDate} from '../../utils/util'

const {regeneratorRuntime} = global;
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module');
const app = getApp();
let api = require('../../utils/api.js');

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
    },
    searchTap: function () {
        wx.navigateTo({
            url: '/pages/indexSearch/indexSearch',
        })
    },
    /* 更多 */
    moreTap: function (e) {
        wx.navigateTo({
            url: '/pages/indexMore/indexMore?album_category_id=' + e.currentTarget.dataset.id,
        })
    },
    /* 专辑详情 */
    albumDetail: function (e) {
        var album_id = e.currentTarget.dataset.id;
        var album_is_vip = e.currentTarget.dataset.is_vip;
        console.log(e.currentTarget.dataset);
        if (!this.data.phoneBind) {
            wx.navigateTo({
                url: '/pages/phone/phone?album_id=' + album_id + '&album_is_vip=' + album_is_vip,
            });
            return false;
        }
        if (album_is_vip) {
            wx.navigateTo({
                url: '/pages/indexList/indexList?album_id=' + album_id,
            });
            return false;
        } else {
            wx.navigateTo({
                url: '/pages/indexList2/indexList2?album_id=' + album_id,
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

    async onLoad() {
        $init(this);

        if (!app.globalData.hasUserInfo) {
            try {
                const session = Session.get();
                if (session) {
                    const login_res = await $request({url: api.is_login, method: 'GET'});
                    if (login_res.data.status) {
                        this.data.userInfo = session.userInfo;
                        this.data.hasUserInfo = true;
                        console.log(session.userInfo);
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
            } catch (e) {
                console.log(e);
            }
        }

        var res = await this.getSlides();
        this.data.slides = res.data;

        res = await this.getAlbumTags();
        this.data.albumTags = res.data;

        res = await this.getAlbumCategories();
        this.data.albumCategories = res.data;

        $digest(this);
    },
    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        var phoneBind = app.globalData.userInfo.hasOwnProperty('phone') && app.globalData.userInfo.phone ? true : false;
        this.setData({
            phoneBind: phoneBind,
            userInfo: app.globalData.userInfo
        });
        var today = getTodayDate(new Date());
        console.log('今天：', today);
        if (app.globalData.hasUserInfo) {
            if (!app.globalData.memberCheckDate || app.globalData.memberCheckDate != today) {
                app.globalData.memberCheckDate = today;
                app.globalData.todayMemberCheck = false;
            }
            if (!app.globalData.todayMemberCheck) {
                var res = await this.checkMemberValid();
                if (res.code == 200) {
                    app.globalData.todayMemberCheck = true;
                    var is_member = res.data.is_member;
                    var session = Session.get();
                    session.userInfo['is_member'] = is_member;
                    session.userInfo['expire_date'] = res.data.expire_date;
                    Session.set(session);
                    app.globalData.userInfo['is_member'] = is_member;
                    app.globalData.userInfo['expire_date'] = res.data.expire_date;
                    console.log(app.globalData);
                    if (!is_member) {
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
});
