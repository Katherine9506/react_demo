// pages/mineOrderAccep/mineOrderAccep.js
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
let api = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        figureImg: [],
        figure_imgs: [],
        remark: '',
    },
    figureTap: function () {
        var figureImg = this.data.figureImg;
        var that = this;
        wx.chooseImage({
            count: 4 - this.data.figureImg.length,
            success: function (res) {
                for (var i = 0; i < res.tempFilePaths.length; i++) {
                    if (figureImg.length < 4) {
                        figureImg.push(res.tempFilePaths[i])
                    }
                }
                console.log(figureImg);
                that.setData({
                    figureImg: figureImg
                });

                that.uploadImages(res.tempFilePaths, -1);
            },
        })
    },
    deleteFigure: function (e) {
        var id = e.target.dataset.id;
        var figureImg = this.data.figureImg;
        var figure_imgs = this.data.figure_imgs;
        figureImg.splice(id, 1);
        figure_imgs.splice(id, 1);
        this.setData({
            figureImg: figureImg,
            figure_imgs: figure_imgs
        });

    },
    editFigure: function (e) {
        var id = e.target.dataset.id;
        var item = "figureImg[" + id + "]";
        var that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                that.setData({
                    [item]: res.tempFilePaths
                });
                console.log(res.tempFilePaths);
                that.uploadImages(res.tempFilePaths, id);
            },
        })
    },
    uploadImages: function (tempFiles, index) {
        var that = this;
        var images = that.data.figure_imgs;
        for (var i = 0, len = tempFiles.length; i < len; i++) {
            wx.uploadFile({
                url: api.image_upload,
                filePath: tempFiles[i],
                name: 'file',
                formData: {
                    'module': 'wx_images',
                    'user': that.data.userInfo.openId
                },
                success(res) {
                    var data = JSON.parse(res.data);
                    data = JSON.parse(data.data);
                    console.log(data);
                    if (index >= 0) {
                        images[index] = data.path;
                    } else {
                        images.push(data.path);
                    }
                    that.setData({
                        figure_imgs: images
                    });
                }
            });
            i++;
        }
    },
    trim: function (str) {
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    },
    bindRemarkBlur: function (e) {
        this.setData({remark: this.trim(e.detail.value)})
    },
    //提交验收
    async acceptanceCheckApply() {
        var that = this;
        var res = await $request({
            url: api.order_acceptance_check,
            method: "POST",
            data: {id: that.data.id, status: 5, figure_imgs: that.data.figure_imgs}
        });
        console.log(res);
        wx.showModal({
            'title': '提示',
            'content': res.msg,
            'showCancel': false,
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/mineOrder/mineOrder?uid=' + that.data.uid,
                    })
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({id: options.id, uid: options.uid});

        let session = Session.get();
        if (session) {
            var userInfo = JSON.parse(session.userInfo);
            this.setData({userInfo: userInfo});
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