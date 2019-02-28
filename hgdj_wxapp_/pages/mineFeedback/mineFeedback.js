import {$init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
let api = require('../../utils/api.js');

// pages/mineFeedback/mineFeedback.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        imageCount: 3,
        count: 0,
        content: '',
        imgList: [],
        images: [],
        contact: '',
    },
    contentChange: function (e) {
        this.setData({
            content: e.detail.value
        });
    },
    contactChange: function (e) {
        this.setData({
            contact: e.detail.value
        })
    },
    chooseImg: function (e) {
        var imgList = this.data.imgList;
        var that = this;
        wx.chooseImage({
            count: that.data.imageCount - that.data.images.length,
            success: function (res) {
                for (var i = 0; i < res.tempFilePaths.length; i++) {
                    if (imgList.length <= 3) {
                        imgList.push(res.tempFilePaths[i])
                    }
                }
                that.setData({
                    imgList: imgList,
                });

                that.uploadImages();

                console.log(that.data.imgList);
            },
        })
    },
    uploadImages: function () {
        var that = this;
        var images = that.data.images;
        for (var i = that.data.count; i < that.data.imgList.length; i++) {
            wx.uploadFile({
                url: api.image_upload, //仅为示例，非真实的接口地址
                filePath: that.data.imgList[i],
                name: 'file',
                formData: {
                    'module': 'wx_images',
                    'user': that.data.userInfo.openId
                },
                success(res) {
                    var data = JSON.parse(res.data);
                    data = JSON.parse(data.data);
                    console.log(res);
                    images.push(data);
                    that.setData({
                        'images': images
                    })
                }
            });
            i++;
        }
        that.setData({
            'count': that.data.imgList.length - 1,
        })
    },
    async formSubmitHandler(e) {
        console.log(this.data.images);
        var content = this.trim(this.data.content);
        var contact = this.trim(this.data.contact);
        var that = this;
        that.setData({
            'images': that.data.images
        });

        var res = await $request({
            url: api.feedback_create,
            method: 'POST',
            data: {
                'content': content,
                'contact': contact,
                'images': that.data.images,
                'openid': that.data.userInfo.openId
            }
        });
        console.log(res);
        let title = res.code ? '反馈成功' : res.msg;
        wx.showToast({
            title: title,
            icon: 'none'
        })
    },
    trim: function (str) {
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        $init(this);

        try {
            const session = Session.get();

            if (session) {
                this.data.userInfo = session.userInfo;
                this.data.userInfo = JSON.parse(this.data.userInfo);
                this.setData({
                    userInfo: this.data.userInfo
                })
            }
        } catch (e) {
            console.log("+++2+++ error:", e)
        }
    }
    ,

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    }
    ,

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
    ,

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
    ,

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})