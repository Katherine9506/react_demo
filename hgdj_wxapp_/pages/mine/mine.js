import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');
let util = require('../../utils/util.js');
const app = getApp()

// pages/mine/mine.js
Page({

    /**
     * 页面的初始数据
     */
    data:
        {
            domain: "https://hgdj-server.oss-cn-hangzhou.aliyuncs.com/",
        },
    settingBtn: function () {
        wx.navigateTo({
            url: '/pages/mineSetting/mineSetting',
        })
    },
    async orderSetTap (event) 
    {
        let formId = event.detail.formId;
        await util.getFormIds(formId);

        wx.navigateTo({
            url: '/pages/mineTakeOrder/mineTakeOrder',
        })
    },
    feedback: function () {
        wx.navigateTo({
            url: '/pages/mineFeedback/mineFeedback',
        });
    },

    async toOrderTap (event) 
    {
        let formId = event.detail.formId;
        await util.getFormIds(formId);

        wx.navigateTo({
            url: '/pages/mineOrder/mineOrder?uid=' + this.data.user.id,
        });
    },

    walletTap: function () {
        wx.navigateTo({
            url: '/pages/mineWallet/mineWallet',
        });
    },
    skilsRz: function () {
        wx.navigateTo({
            url: '/pages/mineSkillCer/mineSkillCer',
        });
    },

    async getPhoneNumber(e) {
        console.log(e.detail)
        const res = await $request({url: api.user_mobile, data: e.detail, method: 'POST'})
        if (res.code == 1) {
            wx.showModal({
                title: '提醒',
                showCancel: false,
                content: '手机号码绑定成功！',
                success: function (res) {
                    wx.navigateTo({
                        url: '/pages/mineSkillCer/mineSkillCer',
                    });
                },
            })
        }
        else {
            wx.showModal({
                title: '提醒',
                showCancel: false,
                content: '手机号码绑定失败，请重新操作！',
                success: function (res) {
                },
            })
        }
        console.log(res)

        // const res = await $request({ url: api.skill_list, data: {}, method: 'POST' })
        // http.get(api.user_mobile, {data:e.detail}, function(res)
        // {
        //     let data = JSON.parse(res.data.data);
        //     app.globalData.userInfo.mobile = data;

        //     console.log(data, "获取用户信息接口")
        //     wx.showToast({title : "绑定手机成功", icon : "success"});

        //     setTimeout(function(){
        //         wx.navigateBack({
        //             delta: 1
        //         })
        //     }, 1000);

        // });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        $init(this);

        try {
            if (app.globalData.hasUser) {
                this.data.user = app.globalData.user;
            } else {
                const session = Session.get();
                if (session) {
                    this.data.userInfo = session.userInfo;
                    this.data.userInfo = JSON.parse(this.data.userInfo);

                    await this.getPageData();
                }
            }
            this.data.version = "1.0.2";
            $digest(this);
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
    onShow() {
        //判断是否有打开过页面
        if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onLoad()
        }
        if (app.globalData.hasUser) {
            this.setData({user: app.globalData.user});
        }
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

    //获取页面所需数据
    async getPageData() {
        const res = await $request({url: api.user_info, data: {openid: this.data.userInfo.openId}, method: 'GET'})
        this.data.user = JSON.parse(res.data)
        console.log(this.data.user)
    },

    // async clickFormView(event)
    // {
    //     // util.getFormIds(event.detail.formId);
    //     let formId = event.detail.formId;
    //     console.log(formId);
    //     if (formId && formId !== 'the formId is a mock one') 
    //     {
    //         await $request({url: api.get_form_id, data: { formId: formId }, method: 'POST'})
    //     }
    // }
})