// pages/mineAudio/mineAudio.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar: ['全部(703)', '英文经典 1岁 +', '英文经典2岁 +', '立体书', '童话', '交通工具', 'Peppa Pig', '蓝色星球上的一天', '千字文', '古诗词', '彩虹鱼系列', '童话', '交通工具', 'Peppa Pig ', '立体书', '童话', '交通工具', '托马斯的朋友'],
    choose:0,

    


  },
  chooseTap:function(e){
    console.log(e.target.dataset.id);

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