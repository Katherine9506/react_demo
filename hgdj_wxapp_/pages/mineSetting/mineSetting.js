// pages/mineSetting/mineSetting.js
import {$request, Session} from "../../lib/page.auth";

const {regeneratorRuntime} = global;
const app = getApp();

let api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        btnDisabled: true,
        avatar: '',
        modalShow: false,
        sex: ['男', '女'],
        constell: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        region: [],
    },
    avatarChange: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                console.log(res.tempFilePaths);
                that.setData({
                    avatar: res.tempFilePaths[0]
                })
                that.uploadImages();
            },
            error: function (res) {
                wx.showToast({
                    title: '调用相机出现错误',
                })
            }
        })
    },
    uploadImages: function () {
        var that = this;
        wx.uploadFile({
            url: api.image_upload, //仅为示例，非真实的接口地址
            filePath: that.data.avatar,
            name: 'file',
            formData: {
                'module': 'wx_images',
                'user': that.data.user.openid
            },
            success(res) {
                var data = JSON.parse(res.data);
                data = JSON.parse(data.data);
                console.log(data);
                that.data.user.thumb = data.path;
                that.setData({
                    user: that.data.user,
                    btnDisabled: false
                });
            }
        });
    },
    cancelTap: function () {
        this.setData({
            modalShow: false
        })
    },
    confirmTap: function (e) {
        this.setData({
            modalShow: false,
            nickname: e.detail.value.name
        })
    },
    bindDateChange: function (e) {
        this.data.user.birth = e.detail.value;
        this.setData({user: this.data.user, btnDisabled: false});
    },
    constellChange: function (e) {
        this.data.user.constell = e.detail.value;
        this.setData({user: this.data.user, btnDisabled: false});
    },
    regionChange: function (e) {
        let region = e.detail.value;
        this.data.user.province = region[0];
        this.data.user.city = region[1];
        this.data.user.area = region[2];
        this.setData({user: this.data.user, region: region, btnDisabled: false});
    },
    nicknameChange: function (e) {
        this.data.user.name = e.detail.value;
        this.setData({user: this.data.user, btnDisabled: false});
    },
    genderChange: function (e) {
        this.data.user.gender = parseInt(e.detail.value) + 1;
        this.setData({user: this.data.user, btnDisabled: false});
        console.log(this.data.user)
    },
    formInit() {
        let user = this.data.user;
        this.setData({
            avatar: user.thumb,
            region: [user.province, user.city, user.area]
        });
    },
    //修改个人信息
    async formSubmitHandler() {
        // this.data.user.gender = this.data.user.gender;
        var res = await $request({
            url: api.user_info_set,
            method: 'POST',
            data: this.data.user
        });
        console.log(res);
        wx.showToast({
            title: res.msg,
            icon: 'none'
        });
        if (res.code) {
            this.setData({'btnDisabled': true});
            app.globalData.user.thumb = this.data.user.thumb;
            app.globalData.user.area = this.data.user.area;
            app.globalData.user.city = this.data.user.city;
            app.globalData.user.province = this.data.user.province;
            app.globalData.user.birth = this.data.user.birth;
            app.globalData.user.constell = this.data.user.constell;
            app.globalData.user.gender = this.data.user.gender;
            app.globalData.user.name = this.data.user.name;
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        if (app.globalData.hasUser) {
            this.data.user = app.globalData.user;
        } else {
            let session = Session.get();
            if (session) {
                this.data.userInfo = JSON.parse(session.userInfo);
                let res = await $request({
                    url: api.user_info,
                    method: 'get',
                    data: {openid: this.data.userInfo.openId}
                });
                this.data.user = JSON.parse(res.data);
            }
        }
        // this.data.user.gender -= 1;
        this.setData({
            user: this.data.user,
        });
        this.formInit();
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
    async onHide() {
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