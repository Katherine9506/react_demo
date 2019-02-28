import {$init, $digest} from '../../lib/page.data'
import {$login, $request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global
//获取应用实例
let api = require('../../utils/api.js');
let util = require('../../utils/util.js');

// pages/mineSkillCer2/mineSkillCer2.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        submitEnable: false,
        labelid: [],
        dan: ['1段', '2段', '3段', '4段'],
        regional: ['1区', '2区', '3区', '4区'],
        // reg:0,
        // idx: ,
        date: '2018-09-20',
        src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        label: [
            {name: '0', value: '大叔', checked: false,},
            {name: '1', value: '正太', checked: false,},
            {name: '2', value: '青年', checked: false,},
            {name: '3', value: '逗逼', checked: false,},
            {name: '4', value: '高冷', checked: false,},
            {name: '5', value: '大神', checked: false,},
            {name: '6', value: '小奶狗', checked: false,},
            {name: '7', value: '话痨', checked: false,},
            {name: '8', value: '话痨2', checked: false,},
        ],
        power: [],     //封面照片
        checkProcotol: 0,
        figureImg: []        //形象照片  最多6张
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
        // var personalPic = this.data.personalPic;
        var that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                that.setData({
                    personalPic: res.tempFilePaths
                });
                that.uploadFile(api.image_upload, res.tempFilePaths[0], 'wx_images', '上传图片失败');
            },
        })
    },

    checkChange: function (e) {
        var that = this;
        var items = this.data.label;
        var checkArr = e.detail.value;
        this.data.labelid = checkArr

        for (var i = 0; i < items.length; i++) {
            if (checkArr.indexOf(items[i].id + "") != -1) {
                items[i].checked = true;
            }
            else {
                items[i].checked = false;
            }
        }
        this.setData({
            label: items
        });
    },

    showDemo: function () {
        wx.navigateTo({
            url: '/pages/mineSkillCerDemo/mineSkillCerDemo',
        })
    },

    showProtocol()
    {
        wx.navigateTo({
            url: '/pages/protocol/protocol?pid=3',
        })
    },

    checkProcotol(e)
    {
        let check;
        if (e.detail.value =='') 
        {
            check = 0
        }
        else 
        {
            check = 1
        }

        console.log(check);
        this.setData({
            checkProcotol: check
        });
    },

    deleteTap: function (e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定删除封面照片吗?',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        personalPic: [],
                        image_id: null
                    })
                }
            }
        })
    },
    editPersonal: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                that.setData({
                    personalPic: res.tempFilePaths
                });
                console.log(that.data.personalPic);
                that.uploadFile(api.image_upload, res.tempFilePaths[0], 'wx_images', '上传图片失败');
            },
        })
    },
    figureTap: function () {
        var figureImg = this.data.figureImg;
        var that = this;
        wx.chooseImage({
            count: 6 - this.data.figureImg.length,
            success: function (res) {
                for (var i = 0; i < res.tempFilePaths.length; i++) {
                    if (figureImg.length < 6) {
                        figureImg.push(res.tempFilePaths[i])
                    }
                }
                ;
                console.log(figureImg);
                that.setData({
                    figureImg: figureImg
                })
            },
        })
    },
    deleteFigure: function (e) {
        var id = e.target.dataset.id;
        var figureImg = this.data.figureImg;
        figureImg.splice(id, 1);
        this.setData({
            figureImg: figureImg
        })
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
            },
        })
    },
    uploadFile: function (api, filePath, module, errorMsg) {
        var that = this;
        var uploadTask = wx.uploadFile({
            url: api,
            filePath: filePath,
            name: 'file',
            formData: {
                'module': module,
                'user': that.data.user_info.openId
            },
            success(res) {
                var data = JSON.parse(res.data);
                if (data.code == 1) {
                    that.setData({image_id: (JSON.parse(data.data)).id});
                } else {
                    wx.showToast({
                        title: errorMsg,
                        icon: 'none'
                    })
                }
            }
        });
        if (uploadTask) {
            uploadTask.onProgressUpdate(function (res) {
                console.log('上传百分比:' + res.progress + '%');
                wx.showToast({title: res.progress + '%', icon: 'none', duration: 1000});
            });
        }
    },
    //提交表单
    async formSubmit (e) 
    {
        let form_id = e.detail.formId;
        await util.getFormIds(form_id);

        if (this.data.checkProcotol === 0) 
        {
            wx.showModal({
                title: '提示',
                content: '请同意陪玩协议！',
                success: function (res) {
                    console.log(res.confirm);
                    // return;
                },
            })
            return;
        }

        this.setData({submitEnable: true});

        let data = e.detail.value;
        data.label_ids = this.data.labelid;
        data.form_id = form_id;
        data.sid = this.data.sid;
        data.image_id = this.data.image_id;
        console.log(data)

        const res = $request({url: api.user_skill_submit, data: data, method: 'POST'})

        console.log(res)

        this.setData({submitEnable: false});

        wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
        })

        setTimeout(function () {
            var pages = getCurrentPages(); // 当前页面
            var beforePage = pages[pages.length - 2]; // 前一个页面
            wx.navigateBack({
                success: function () {
                    beforePage.onLoad(); // 执行前一个页面的onLoad方法
                }
            });
        }, 1000)
    },


    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this)

        let id = options.id;
        this.data.sid = id;

        try {
            const session = Session.get()

            if (session) {
                let user_info = JSON.parse(session.userInfo)
                this.data.user_info = user_info;
                console.log(user_info);

                const res = await $request({
                    url: api.user_skill_info,
                    data: {openid: user_info.openId, sid: id},
                    method: 'POST'
                })
                console.log(JSON.parse(res.data))
                let res_data = JSON.parse(res.data)
                this.data.dan = res_data.paragraph
                this.data.regional = res_data.largearea
                this.data.label = res_data.label
                this.data.idx = res_data.idx
                this.data.reg = res_data.reg
                this.data.user_skill = res_data.user_skill
                this.data.skill_name = res_data.skill_name
                this.data.personalPic = res_data.user_skill.image ? [res_data.user_skill.image] : [];
                // let user_data = JSON.parse(res.data)
                // this.data.user = user_data
                // this.data.personalPic = user_data.cover
                // this.data.figureImg = user_data.images

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