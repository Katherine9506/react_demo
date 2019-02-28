// pages/playConfirmOver/playConfirmOver.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        hour: 4,
        minute: 0,
        second: 0,
    },
    clipboardTap: function () {
        wx.setClipboardData({
            data: '阿迪多的 v',
        })
    },
    confirmServer:function(){
        wx.showModal({
            title: '提示',
            content: '请确保服务完成后再确认',
            confirmColor:'#0362dc',
            success:function(res){
                if (res.confirm){
                    wx.navigateTo({
                        url: '/pages/playEvaluate/playEvaluate',
                    })
                }
                
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var hour = this.data.hour,
            minute = this.data.minute,
            second = this.data.second;
        var that = this;
        var timer = setInterval(function () {
            if (second > 0) {
                second--;
            } else if (second == 0 && minute > 0) {
                minute--;
                second = 59;
            } else if (second == 0 && minute == 0 && hour > 0) {
                hour--;
                minute = 59;
                second = 59;
            } else {
                console.log(hour, minute, second);
            }
            that.setData({
                hour: hour,
                minute: minute,
                second: second
            })
        }, 1000);
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