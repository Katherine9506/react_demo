// pages/mineSkillCer2/mineSkillCer2.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dan: ['1段', '2段', '3段', '4段'],
        regional: ['1区', '2区', '3区', '4区'],
        reg: 1,
        idx: 2,
        date: '2018-09-20',
        src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        items: [
            { name: '0', value: '大叔', checked: false, },
            { name: '1', value: '正太', checked: true, },
            { name: '2', value: '青年', checked: false, },
            { name: '3', value: '逗逼', checked: false, },
            { name: '4', value: '高冷', checked: false, },
            { name: '5', value: '大神', checked: true, },
            { name: '6', value: '小奶狗', checked: true, },
            { name: '7', value: '话痨', checked: false, },
            { name: '8', value: '话痨2', checked: false, },
        ],
        power: [],     //封面照片
        figureImg: [],        //形象照片  最多6张
        personalPic: ['/images/shili.png'],
        msg:'陪玩游戏介绍介绍,陪玩游戏介绍介绍陪玩游戏介绍介绍,陪玩游戏介绍介绍,,陪玩游戏介绍介绍',
        agreementCheck:true
    },
    checkChange: function (e) {
        var that = this;
        var items = this.data.items;
        var checkArr = e.detail.value;
        for (var i = 0; i < items.length; i++) {
            if (checkArr.indexOf(i + "") != -1) {
                items[i].checked = true;
            } else {
                items[i].checked = false;
            }
        }
        this.setData({
            items: items
        });
    },
    sexChange: function (e) {
        this.setData({
            idx: e.detail.value
        })
    },
    regChange: function (e) {
        this.setData({
            reg: e.detail.value
        })
    },
    personalImg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                that.setData({
                    personalPic: res.tempFilePaths
                })
            },
        })
    },
    deleteTap: function (e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定删除实力截图?',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        personalPic: []
                    })
                }
            }
        })
    },
    showDemo:function(){
        wx.navigateTo({
            url: '/pages/mineSkillCerDemo/mineSkillCerDemo',
        })
    },
    editPersonal: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                that.setData({
                    personalPic: res.tempFilePaths
                })
            },
        })
    },
    submitAgain:function(){
        wx.showModal({
            title: '提示',
            content: '提交后资料须进行重新进行审核,确定重新提交吗?',
            confirmColor:'#0362DC'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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