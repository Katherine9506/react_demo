import { $init, $digest } from '../../lib/page.data'
import { $login, $request, Session } from '../../lib/page.auth'

const { regeneratorRuntime } = global
//获取应用实例
let api  = require('../../utils/api.js');
const app = getApp()

// pages/mineSkillCer/mineSkillCer.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    editPersonal: function () {
        wx.navigateTo({
            url: '/pages/minePersonal/minePersonal',
        })
    },
    toRzTap: function (e) 
    {
        if (this.data.user.is_cert != 2) 
        {
            wx.showModal({
                title: '提示',
                content: '请先认证个人信息',
                success: function(res) {
                    if (res.confirm) 
                    {
                        console.log('用户点击确定')
                    } 
                    else if (res.cancel) 
                    {
                        console.log('用户点击取消')
                    }
                }
            })
        }
        else
        {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: '/pages/mineSkillCer2/mineSkillCer2?id='+id,
            })
        }
        
    },
    // changeCerTap: function () {
    //     wx.navigateTo({
    //         url: '/pages/mineSkillCer3/mineSkillCer3',
    //     })
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) 
    {
        $init(this)

        try {
            const session = Session.get()

            if (session) 
            {
                let userInfo = JSON.parse(session.userInfo);

                const res = await $request({ url: api.user_info, data: {openid:userInfo.openId}, method: 'GET' });
                console.log(JSON.parse(res.data))
                this.data.user = JSON.parse(res.data)

                //获取用户技能数据
                const user_skill_res = await $request({ url: api.user_skill, data: {openid:userInfo.openId}, method: 'POST' });
                console.log(JSON.parse(user_skill_res.data))
                this.data.skill_list = JSON.parse(user_skill_res.data)
                if (Object.keys(this.data.skill_list.has_skill).length === 0) 
                {
                    this.data.haskill = false;
                }
                else
                {
                    this.data.haskill = true;
                }

                $digest(this)
            }
        }
        catch (err) 
        {
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

    }
})