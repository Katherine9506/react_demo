import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
//获取应用实例
let api = require('../../utils/api.js');

// pages/indexNavipage/indexNavipage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: ['综合', '热门', '新人'],
        desc: ['general', 'hot', 'newbie'],
        array2: ['全部', '男生', '女生'],
        index: 0,
        index2: 0,
        beauty: [
            {
                bName: '玖月',
                bUrl: '/images/wh1.jpg',
                tags: ['温柔', '开朗', '大神'],
                zanNum: 12,
                zt: '求单ing',
                address: '武汉',
                price: 50
            }
        ]
    },
    lookDetail: function (e) {
        let id = e.currentTarget.dataset.id;
        console.log(id)
        wx.navigateTo({
            url: '/pages/indexBuy/indexBuy?id=' + id
        })
    },
    async picker1Change(e) {
        console.log(e.detail.value);
        this.setData({
            index: e.detail.value
        });
        var res = await this.getSkillPrice();
        var data = JSON.parse(res.data);
        console.log(data);
        this.setData({priceList: data});
    },
    async picker2Change(e) {
        this.setData({
            index2: e.detail.value
        });
        var res = await this.getSkillPrice();
        var data = JSON.parse(res.data);
        console.log(data);
        this.setData({priceList: data})
    },
    /* 选择器触发请求 */
    async getSkillPrice() {
        var that = this;
        var res = await $request({
            url: api.price_list,
            method: 'POST',
            data: {type: that.data.desc[that.data.index], gender: that.data.index2, sid: that.data.sid}
        });
        console.log(res);
        return res;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        let id = options.id;//技能ID
        let name = options.name;//技能名称
        this.setData({sid: id});
        wx.setNavigationBarTitle({title: name});

        try {
            const session = Session.get()

            if (session) {
                let user_info = JSON.parse(session.userInfo)
                console.log(user_info)

                const res = await $request({url: api.price_list, data: {sid: options.id}, method: 'POST'})
                console.log(JSON.parse(res.data));
                this.data.priceList = JSON.parse(res.data)
                console.log("价格列表:", this.data.priceList)

                $digest(this)
            }
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