// pages/mineTakeOrder/mineTakeOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        modalShow: false,
        modal2Show: false,
        severTime:1,
        severPrice:'未设置',
        btnTxt:'开始接单',
        onOff:true
    },
    cancelTap: function () {
        this.setData({
            modalShow: false,
            modal2Show: false,
        })
    },
    confirmTap: function (e) {
        this.setData({
            modalShow: false
        });
        if (e.detail.value.time){
            this.setData({
                severTime: e.detail.value.time
            });
        }
    },

    timesetTap: function (e) {
        this.setData({
            modalShow:true
        })
    },
    setpriceTap:function(){
        this.setData({
            modal2Show: true
        })
    },
    priceTap:function(e){
        this.setData({
            modal2Show: false
        });
        if (e.detail.value.price) {
            this.setData({
                severPrice: e.detail.value.price
            });
        }
    },
    startTakeOrder:function(e){
        var lTime = e.detail.value.longTime;
        var pPrice = e.detail.value.price;
        var that=this;
        if (lTime > 0 && pPrice != '未设置' && this.data.onOff){
            wx.showModal({
                title: '提示',
                content: '确定开始接单吗?',
                confirmColor: '#0362DC',
                success: function (res) {
                    if(res.confirm){
                        wx.showToast({
                            title: '设计接单成功',
                            // icon:'none'
                        });
                        that.setData({
                            btnTxt:'接单中',
                            onOff:false
                        });
                        // wx.setStorage({
                        //     key: '',
                        //     data: '',
                        // });
                    };
                },
                fail: function (res) { },
                complete: function (res) { },
            })
        } if (lTime > 0 && pPrice != '未设置' && !this.data.onOff){
            wx.showToast({
                title: '成功取消接单',
                icon: 'none'
            });
            that.setData({
                btnTxt: '开始接单',
                onOff: true
            });
        }
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