// pages/shanyue/shanyue.js
import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
let api = require('../../utils/api.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navTab: ['英雄联盟', '绝地求而', '刺激战场', '王者荣耀', '唱歌', '声优聊天', '叫醒管家', 'Dota2'],
        currentTab: 0,
        radioList: [
            {
                value: '寻找小姐姐',
                url: '/images/lookfor-girl.png',
                name: 'girl',
                checked: true
            },
            {
                value: '寻找小哥哥',
                url: '/images/lookfor-boy.png',
                name: 'boy',
                checked: false
            }
        ],
        radioValue: '', //寻找对象类型，boy/girl
        formType: 0 //游戏选项对应的数据库ID  游戏类型
    },
    tabTap: function (e) {
        var dataset = e.currentTarget.dataset;
        this.setData({
            formType: dataset.id
        });
        if (this.currentTab == dataset.index) {
            return false;
        } else {
            this.setData({
                currentTab: dataset.index
            });
        }
        this.checkCor();
    },
    checkCor: function () {
        if (this.data.currentTab >= 3) {
            this.setData({
                scrollLeft: 500
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    radioChange: function (e) {
        console.log(e)
        this.setData({
            radioValue: e.detail.value,
        })
    },
    lookforFri: function () {
        console.log(this.data.formType);
        wx.navigateTo({
            url: '/pages/shanyueLookfor/shanyueLookfor?sid=' + this.data.formType + '&gender=' + this.data.radioValue,
        })
    },
    async getSkills() {
        const res = await $request({url: api.skill_list, data: {}, method: 'POST'})
        let skill_list = JSON.parse(res.data)
        console.log("技能数据:", skill_list)
        return skill_list
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this);

        try {
            const session = Session.get();

            if (session) {
                this.data.userInfo = JSON.parse(session.userInfo);
                console.log(this.data.userInfo);

                let skill_list = await this.getSkills();
                this.data.navTab = skill_list.data;
                this.data.formType = skill_list.data[0].id;
                console.log(this.data.navTab);
                $digest(this);
            } else {
                console.log('未登录');
            }
        } catch (e) {
            console.log('#########error2:', e)
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var value = this.data.navTab[0]
        this.setData({
            radioValue: this.data.radioList[0].name,
        })
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