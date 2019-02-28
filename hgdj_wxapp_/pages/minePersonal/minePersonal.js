import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
let recorder = wx.getRecorderManager();
//获取应用实例
let api = require('../../utils/api.js');
let util = require('../../utils/util.js');

// pages/minePersonal/minePersonal.js
var timer = null;
var time = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        submitEnable: false,
        sex: ['保密', '男', '女'],
        date: '2018-09-20',
        src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        voicePath: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        label: [
            {name: '0', value: '大叔', checked: false,},
            {name: '1', value: '正太', checked: true,},
            {name: '2', value: '青年', checked: false,},
            {name: '3', value: '逗逼', checked: false,},
            {name: '4', value: '高冷', checked: false,},
            {name: '5', value: '大神', checked: true,},
            {name: '6', value: '小奶狗', checked: true,},
            {name: '7', value: '话痨', checked: false,},
            {name: '8', value: '话痨2', checked: false,},
        ],
        image_ids: [],
        personalPic: [],     //封面照片
        figureImg: [],        //形象照片  最多6张

        torecord: false,
        record: false,
        timeLength: 0,
        recordTime: 0,
        iconShow: false,
        cover_id: null,
        checkProcotol: 0,
        //recordFile
    },

    playAudio(e) {
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            // 播放音频失败的回调
            console.log('############播放音频失败################');
            console.log(res);
        });
        this.innerAudioContext.src = this.data.recordFile;  // 这里可以是录音的临时路径
        this.innerAudioContext.play();
    },

    recordTap: function () {
        this.setData({
            torecord: true
        });
        // this.data.torecord = true
    },

    recordStart: function (e) {
        var that = this;
        that.setData({
            record: true,
            timeLength: 0,
        });

        recorder.onStop(function (res) {//监听录音结束
            console.log("##################");
            console.log(res.tempFilePath);
            that.data.recordFile = res.tempFilePath;
        });

        recorder.onError(function (res) {
            // 录音失败的回调处理
            console.log('#######录音失败############');
            console.log(res);
        });

        recorder.start({
            duration: 60000,//录音时长：一分钟
            format: 'mp3',//音频格式 ：mp3格式
        });

        var timeLength = that.data.timeLength;
        timer = setInterval(function () {
            timeLength++;
            if (timeLength == 60) {
                clearInterval(timer);
            }
            that.setData({
                timeLength: timeLength
            })
        }, 1000)
    },

    //停止录音
    stopRecord: function (e) {
        var that = this;
        clearInterval(timer);
        recorder.stop();//停止录音
        that.setData({iconShow: true});
    },

    recordEnd: function (e) {
        console.log(2, e);
        clearInterval(timer);
        var that = this;
        wx.stopRecord();//结束录音
        that.setData({
            iconShow: true
        });
    },

    backTap: function () {
        this.setData({
            torecord: false,
            record: false,
            iconShow: false,
            timeLength: 0
        });
    },

    confirmTap: function () {
        var that = this;
        var timeLength = this.data.timeLength;
        if (timeLength < 5) {
            wx.showToast({
                title: '录音不能短于5秒钟',
                icon: 'none',
                image: '',
                duration: 1000,
                mask: true,
                success: function (res) {
                },
                fail: function (res) {
                },
                complete: function (res) {
                },
            })
        }
        else {
            //上传录音文件
            console.log(this.data.recordFile, '=========')
            wx.uploadFile({
                url: api.audio_upload, //仅为示例，非真实的接口地址
                filePath: that.data.recordFile,
                name: 'file',
                formData: {
                    'module': 'wx_audio',
                    'user': that.data.userInfo.openId
                },
                success(res) {
                    const data = JSON.parse(res.data);
                    if (data.code == 1) {
                        let audio_data = JSON.parse(data.data);
                        that.data.audio_id = audio_data.id;
                        console.log("audio_path:" + audio_data.path);
                        that.setData({src: audio_data.path});
                    }
                }
            })
            this.setData({
                torecord: false,
                record: false,
                iconShow: false,
                recordTime: this.data.timeLength,
                timeLength: 0
            });
        }
    },


    sexChange: function (e) {
        this.setData({
            idx: e.detail.value
        })
    },
    dateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    personalImg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                const tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: api.image_upload, //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'module': 'wx_images',
                        'user': that.data.userInfo.openId
                    },
                    success(res) {
                        const data = JSON.parse(res.data)
                        if (data.code == 1) {
                            let cover_data = JSON.parse(data.data)
                            that.data.cover_id = cover_data.id
                        }
                    }
                });
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
            content: '确定删除封面照片吗?',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        personalPic: [],
                        cover_id: null
                    });
                }
            }
        })
    },
    editPersonal () {
        var that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                that.setData({
                    personalPic: res.tempFilePaths
                });
                that.uploadImage(res.tempFilePaths[0]);
            },
        })
    },

    figureTap: function () {
        var figureImg = this.data.figureImg;
        var that = this;
        console.log(this.data.figureImg.length, '999999999999')
        wx.chooseImage({
            count: 6 - this.data.figureImg.length,
            success: function (res) {
                const tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: api.image_upload, //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'module': 'wx_images',
                        'user': that.data.userInfo.openId
                    },
                    success(res) {
                        const data = JSON.parse(res.data)
                        if (data.code == 1) {
                            let image_data = JSON.parse(data.data)
                            let img_data = {id: parseInt(image_data.id), path: image_data.path};
                            figureImg.push(img_data)

                            that.setData({
                                figureImg: figureImg
                            })
                        }
                    }
                });
                console.log(that.data.figureImg)
            },
        })
    },
    deleteFigure: function (e) {
        var id = e.target.dataset.id;
        var figureImg = this.data.figureImg;
        var image_ids = this.data.image_ids;
        var newArr = figureImg.filter(function (obj) {
            return id !== obj.id;
        });
        this.setData({
            figureImg: newArr
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
    checkChange: function (e) {
        var that = this;
        var items = this.data.label;
        var checkArr = e.detail.value;
        this.data.labelid = checkArr
        console.log(this.data.labelid)

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

    uploadImage(filepath){
        var that = this;
        wx.uploadFile({
            url:api.image_upload,
            filePath: filepath,
            name: 'file',
            formData: {
                'module': 'wx_images',
                'user': that.data.userInfo.openId
            },
            success(res) {
                const data = JSON.parse(res.data);
                if (data.code) {
                    var image_data = JSON.parse(data.data);
                    that.data.cover_id = image_data.id;
                }
            }
        });
    },

    //提交表单
    async formSubmit (e) 
    {
        let form_id = e.detail.formId;
        await util.getFormIds(form_id);
        console.log(this.data.checkProcotol);
        if (this.data.checkProcotol === 0) 
        {
            wx.showModal({
                title: '提示',
                content: '请同意用户协议！',
                success: function (res) {
                    console.log(res.confirm);
                    // return;
                },
            })
            return;
        }
        // return;
        const session = Session.get()
        let user_info = JSON.parse(session.userInfo);

        let image_data = this.data.figureImg
        let image_ids = [];
        for (var i = image_data.length - 1; i >= 0; i--) {
            image_ids.push(image_data[i].id);
        }

        this.setData({submitEnable: true});

        
        let data = e.detail.value;
        data.form_id = form_id;
        data.cover_id = this.data.cover_id;
        data.images = image_ids;
        data.labels = this.data.labelid;
        data.openid = user_info.openId;
        data.audio_id = this.data.audio_id;

        const res = $request({url: api.user_check_submit, data: data, method: 'POST'})

        this.setData({submitEnable: false});

        wx.showModal({
            title: '提示',
            content: '提交完成，等待平台审核',
            success: function (res) {
                console.log(res.confirm);
                if (res.confirm) {
                    var pages = getCurrentPages(); // 当前页面
                    var beforePage = pages[pages.length - 2]; // 前一个页面
                    wx.navigateBack({
                        success: function () {
                            beforePage.onLoad(); // 执行前一个页面的onLoad方法
                        }
                    });
                }
            },
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        $init(this)

        try {
            const session = Session.get()

            if (session) {
                this.data.userInfo = session.userInfo;
                this.data.userInfo = JSON.parse(this.data.userInfo)
                console.log(this.data.userInfo)

                const res = await $request({
                    url: api.user_check,
                    data: {openid: this.data.userInfo.openId},
                    method: 'POST'
                })
                console.log(JSON.parse(res.data))
                let user_data = JSON.parse(res.data)
                this.data.user = user_data
                this.data.label = user_data.label
                this.data.voicePath = user_data.audio
                if (user_data.cover.length !== 0) {
                    this.data.personalPic[0] = user_data.cover
                }

                // this.data.cover_id = user_data.cover_id
                this.data.figureImg = user_data.images;
                this.data.recordFile = api.oss_domain + user_data.audio.path;
                console.log(user_data.audio.path);
                console.log(this.data.personalPic.length);
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

    },

    showProtocol()
    {
        wx.navigateTo({
            url: '/pages/protocol/protocol?pid=4',
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

        // console.log(e.detail.value);
        console.log(check);
        this.setData({
            checkProcotol: check
        });
    },
})