import { $init, $digest } from '../../lib/page.data'
import { $login, $request, Session } from '../../lib/page.auth'

const { regeneratorRuntime } = global
//获取应用实例
let api  = require('../../utils/api.js');

var WxParse = require('../../wxParse/wxParse/wxParse.js');

// pages/news-detail/news-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
    
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) 
    {
        $init(this)
        let id = options.pid;

        console.log(id);
        try {
            const session = Session.get()

            if (session) 
            {
                //请求新闻详情数据
                const res = await $request({ url: api.protocol_detail, data: {id:id}, method: 'POST' });
                let protocol_detail = JSON.parse(res.data);
                let article = protocol_detail.content;
                WxParse.wxParse('article', 'html', article, this, 3);
                this.data.protocolDetail = protocol_detail;

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