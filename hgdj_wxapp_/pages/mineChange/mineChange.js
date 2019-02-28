// pages/mineChange/mineChange.js
import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

// let time = require('../../utils/date');

const {regeneratorRuntime} = global;
//获取应用实例
let api = require('../../utils/api.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        opDetails: [],//操作列表
        type: '',//明细类型 change | withdraw
        changeStatus: [
            '待支付', '待接单', '待陪玩', '陪玩中', '待验收', '待评价', '已评价'
        ],
        page: 1,
        pageable: true,
    },
    //加载明细
    async getOpDetails() {
        let res = await $request({
            url: api.opDetails,
            method: 'GET',
            data: {type: this.data.type, page: this.data.page}
        });
        console.log(res);
        return res;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);
        this.data.type = options.type;

        if (app.globalData.hasUser) {
            this.data.user = app.globalData.user;
        } else {
            let session = Session.get();
            if (session) {
                this.data.userInfo = session.userInfo;
                this.data.userInfo = JSON.parse(this.data.userInfo);
                var user = await $request({
                    url: api.user_info,
                    method: 'post',
                    data: {openid: this.data.userInfo.openId}
                });
                this.data.user = JSON.parse(user.data);
            }
        }
        let res = await this.getOpDetails();
        var data = JSON.parse(res.data);
        this.data.opDetails = data.data;
        if (data.current_page == data.last_page) {
            this.data.pageable = false;
        }

        $digest(this);
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
    async onReachBottom() {
        if (this.data.pageable) {
            let res = await this.getOpDetails();
            var data = JSON.parse(res.data);
            this.data.opDetails = this.data.opDetails.concat(data.data);
            if (data.current_page == data.last_page) {
                this.data.pageable = false;
            } else {
                this.data.page = this.data.page + 1;
            }
            this.setData({
                opDetails: this.data.opDetails,
                pageable: this.data.pageable,
                page: this.data.page
            });
        } else {
            wx.showToast({
                icon: 'none',
                title: '没有更多数据了哟'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})