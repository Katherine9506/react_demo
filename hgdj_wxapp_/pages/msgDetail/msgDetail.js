// pages/msgDetail/msgDetail.js
import {$digest, $init} from '../../lib/page.data'
import {$request, Session} from '../../lib/page.auth'

const {regeneratorRuntime} = global;
const app = getApp();
let api = require('../../utils/api.js');
let emojis = require('../../emoji/emoji');
var WxParse = require('../../wxParse/wxParse/wxParse.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        _wxapp: api.oss_domain + '/upload/wxapp',
        voiceSrc: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        moreFn: false,
        fsBtn: false,
        enterTxt: true,
        chats: [],//聊天记录
        tempFilePath: '',//发送图片
        audioTempFile: '',//录音文件的临时路径
        recorder: null,
        inRecord: false,
        innerAudioContext: null,
        message: '',
        messageWithIcon: '',
        currentAudioSrc: '',//当前正在播放的语音文件地址
        index: -1,//
        onOff: true,//无语音在播放
        //emojis datas:type,emojiIcons,showEmoji
        //user_id,chater=[id,name,thumb]
    },
    scrollMessages: function () {
        var that = this;
        wx.createSelectorQuery().select('#messages').boundingClientRect(function (rect) {
            console.log(rect);
            // wx.pageScrollTo({scrollTop: rect.bottom});
            wx.pageScrollTo({scrollTop: 1000 * that.data.chats.length});
        }).exec(function (res) {
            console.log('exec:res---' + res);
        });
    },
    updateTime: function (e) {
        console.log(e.detail);
    },
    moreFnTap: function (e) {
        var moreFn = this.data.moreFn;
        this.setData({
            moreFn: !moreFn
        })
    },
    enterTap: function (e) {
        if (e.detail.value && this.trim(e.detail.value) != '') {
            this.setData({
                fsBtn: true
            })
        } else {
            this.setData({
                fsBtn: false
            })
        }
    },
    trim: function (str) {
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    },
    //emoji相关函数
    //显示/隐藏 emojis
    showEmojis: function () {
        this.setData({showEmoji: !this.data.showEmoji});
    },
    //切换Emoji
    switchIconType: function (e) {
        this.setData({
            type: e.currentTarget.dataset.type
        });
    },
    //选择Emoji
    selectEmoji: function (e) {
        var dataset = e.currentTarget.dataset;
        var id = dataset.id;
        var emoji_code = dataset.emoji_code;
        this.setData({message: this.data.message + emoji_code, fsBtn: true});
    },
    luyinTap: function (e) {
        var enterTxt = this.data.enterTxt;
        this.setData({
            enterTxt: !enterTxt
        })
    },
    messageBlur: function (e) {
        this.setData({message: e.detail.value});
        if (e.detail.value && this.trim(e.detail.value) != '') {
            this.setData({fsBtn: true});
        }
    },
    //录音
    startRecord: function (e) {
        var recorder = wx.getRecorderManager();
        var that = this;
        that.data.recorder = recorder;

        recorder.onStop(function (res) {
            that.data.audioTempFile = res.tempFilePath;
            console.log(res);
            that.uploadFile(api.audio_upload, res.tempFilePath, 'wx_audio', '语音发送失败', 3);
        });
        that.setData({inRecord: true});

        recorder.start({
            format: 'mp3'
        });
    },
    stopRecord: function () {
        this.data.recorder.stop();//停止录音
        this.setData({inRecord: false});
    },
    //播放语音消息
    playAudio: function (e) {
        console.log('进入playAudio方法');
        var playAudioSrc = e.currentTarget.dataset.src;
        var index = e.currentTarget.dataset.index;
        var chats = this.data.chats;
        if (this.data.onOff) {
            console.log('播放语音');
            this.data.currentAudioSrc = playAudioSrc;
            this.data.innerAudioContext.src = playAudioSrc;
            chats[index].is_play = true;
            this.setData({chats: chats, index: index});
            this.data.innerAudioContext.play();
            this.data.onOff = !this.data.onOff;
        } else if (this.data.currentAudioSrc == playAudioSrc) {
            console.log('播放或暂停');
            var paused = this.data.innerAudioContext.paused;
            if (paused) {
                this.data.innerAudioContext.pause();
                chats[index].is_play = false;
                this.setData({chats: chats, index: index});
            } else {
                chats[index].is_play = true;
                this.setData({chats: chats, index: index});
                this.data.innerAudioContext.play();
            }
        } else {
            console.log('切换播放语音');
            this.data.innerAudioContext.stop();
            this.data.currentAudioSrc = playAudioSrc;
            this.data.innerAudioContext.src = playAudioSrc;
            this.data.innerAudioContext.startTime = 0;
            chats[this.data.index].is_play = false;
            chats[index].is_play = true;
            this.setData({chats: chats, index: index});
            this.data.innerAudioContext.play();
        }
    },
    //选择照片
    selectAlbum: function () {
        this.chooseImage('album');
    },
    //拍照
    takePhoto: function () {
        this.chooseImage('camera');
    },
    chooseImage: function (sourceType) {
        var that = this;
        wx.chooseImage({
            count: 1,//最多可以选择的图片张数
            sizeType: 'compressed',//压缩图
            sourceType: [sourceType],//图片来源 相册
            success: function (res) {
                console.log(res);
                that.setData({tempFilePath: res.tempFilePaths[0]});
                that.uploadFile(api.image_upload, res.tempFilePaths[0], 'wx_images', '语音发送失败', 2);
            }
        });
    },
    //预览图片
    previewImage: function (e) {
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        });
    },
    //上传文件 视频/音频
    uploadFile: function (api, filePath, module, errorMsg, type) {
        var that = this;
        var uploadTask = wx.uploadFile({
            url: api,
            filePath: filePath,
            name: 'file',
            formData: {
                'module': module,
                'user': that.data.userInfo.openId
            },
            success(res) {
                var data = JSON.parse(res.data);
                if (data.code == 1) {
                    //发送socket消息
                    that.sendChat({detail: {value: {message: (JSON.parse(data.data)).path, type: type}}});
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
    //发送消息
    sendChat: function (e) {
        var now = new Date();
        let data = {
            message: e.detail.value.message,
            send_uid: this.data.user.id,
            rec_uid: this.data.chater.id,
            type: e.detail.value.hasOwnProperty('type') ? e.detail.value.type : 1,//默认文本消息
            timeShown: now.getHours() + ':' + now.getMinutes(),
        };

        console.log('发送的数据为:' + JSON.stringify(data));
        if (data.type == 1) {
            data.message = emojis.emojiParse(this.data._wxapp, data.message);
        }
        console.log(data.message);
        console.log(data);
        this.updateChats(data);
        this.scrollMessages();
        this.updateGlobalChats(data);
        this.updateGlobalChaters(data);
        this.sendSocketMessage(data);
        this.setData({message: ''});
    },
    //将message转为rich-text支持的文本
    parseHtml2RichNode: function (data) {
        var parsed = WxParse.wxParse('message', 'html', data.message, this);
        var nodes = parsed.nodes;
        for (let i = 0; i < nodes.length; i++) {
            nodes[i]['name'] = nodes[i].tag ? nodes[i].tag : 'div';
            nodes[i]['attrs'] = nodes[i].attr ? nodes[i].attr : {style: 'display: inline'};
            if (nodes[i].node == 'text') {
                nodes[i]['children'] = [{
                    type: nodes[i].textArray[0].node, text: nodes[i].textArray[0].text
                }];
            }
        }
        return nodes;
    },
    //更新全局chats
    updateGlobalChats: function (data, onMessage = false) {
        console.log(data);
        var chats = app.globalData.chats;
        if (data.type == 3) data.is_play = false;
        if (onMessage) {
            chats[data.send_uid].push(data);
        } else {
            chats[this.data.chater.id].push(data);
        }
        app.globalData.chats = chats;
        // console.log('全局chats:' + JSON.stringify(app.globalData.chats));
    },
    //更新chats
    updateChats: function (data) {
        console.log(data);
        var chats = this.data.chats;
        if (data.type == 3) data.is_play = false;
        chats.push(data);
        this.setData({chats: chats});
    },
    //更新全局chaters中当前对象的lastMessage,lastTime,lastMsgType
    updateGlobalChaters: function (data, onMessage = false) {
        var chaters = app.globalData.chaters;
        if (onMessage) {
            if (!chaters.hasOwnProperty(data.send_uid)) {
                var pivot = {chater_id: data.send_uid};
                chaters[data.send_uid] = {
                    lastMessage: data.message,
                    unRead: 0,
                    timeShown: data.timeShown,
                    lastMsgType: data.type,
                    name: data.sendUser.name,
                    thumb: data.sendUser.thumb,
                    pivot: pivot,
                };
            } else {
                chaters[data.send_uid].lastMessage = data.message;
                chaters[data.send_uid].timeShown = data.timeShown;
                chaters[data.send_uid].lastMsgType = data.type;
            }
        } else {
            chaters[this.data.chater.id].lastMessage = data.message;
            chaters[this.data.chater.id].timeShown = data.timeShown;
            chaters[this.data.chater.id].lastMsgType = data.type;
        }
        app.globalData.chaters = chaters;
    },
    //发送消息
    sendSocketMessage: function (data) {
        data = JSON.stringify(data);
        if (!app.globalData.socketOpen) {
            console.log('重新连接websocket服务器');
            app.prepareSocket(null, true);
        }
        wx.sendSocketMessage({
            data: data,
            success: function (res) {
                console.log('发送数据成功');
            },
            fail: function (res) {
                console.log('发送失败，重新连接websocket');
                console.log(res);
                app.globalData.socketOpen = false;
                app.globalData.socketConnect = false;
                app.prepareSocket(function () {
                    wx.sendSocketMessage({
                        data: data,
                        success: function (res) {
                            console.log('发送数据成功');
                        }
                    })
                }, true);
                //界面提示接口调用错误信息：
            }
        });
    },
    //获取历史聊天记录
    async getChatHistory() {
        var res = await $request({
            url: api.chat_history,
            type: 'GET',
            data: {user_id: this.data.user.id, chater_id: this.data.chater.id}
        });
        // if (res.data.length > 0) {
        //     for (var i = 0; i < res.data.length; i++) {
        //         if (res.data[i].type == 1) {
        //             res.data[i].message = emojis.emojiParse(this.data._wxapp, res.data[i].message);
        //         }
        //     }
        // }
        return res;
    },
    //添加至聊天对象列表
    async addToUserChater() {
        var res = await $request({
            url: api.add_user_chater,
            type: 'POST',
            data: {user_id: this.data.user_id, chater_id: this.data.chater.id}
        });
        console.log(res);
        return res;
    },
    //获取历史聊天记录，下拉刷新
    async getPageChatHistory() {
        var res = await $request({
            url: api.chat_history,
            type: 'GET',
            data: {user_id: this.data.user.id, chater_id: this.data.chater.id, chat_id: this.data.chats[0].id}
        });
        // console.log(res);
        return res;
    },
    //更新全局chaters中当前对象unRead为0
    updateMessageReadStatus: function (status) {
        app.globalData.chaters[this.data.chater.id].unRead = status;
    },
    //更新数据库当前对象所有消息为已读状态
    async updateDbMessage2Read() {
        var res = await $request({
            url: api.chat_read,
            method: 'POST',
            data: {user_id: this.data.user_id, chater_id: this.data.chater.id}
        });
        console.log(res);
        if (res.code == 204) {
            this.updateMessageReadStatus(0);
        } else {
            wx.showToast({
                title: '检查网络',
                icon: 'none'
            })
        }
    },
    timestampToTime: function (timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        return m + ':' + s;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        var that = this;
        $init(that);

        that.data.user_id = options.user_id;
        that.data.chater = {id: options.chater_id, name: options.chater_name, thumb: options.chater_thumb};

        try {
            if (app.globalData.hasUser){
                that.data.user = app.globalData.user;
            }else{
                const session = Session.get();
                if (session){
                    that.data.userInfo = session.userInfo;
                    that.data.userInfo = JSON.parse(that.data.userInfo);
                    await that.getPageData();
                }
            }
            //①没有初始化chaters ②没有与该用户建立聊天关系
            if (!app.globalData.chaters.hasOwnProperty(options.chater_id)) {
                var pivot = {user_id: options.user_id, chater_id: options.chater_id};
                var now = new Date();
                app.globalData.chaters[that.data.chater.id] = {
                    name: that.data.chater.name,
                    thumb: that.data.chater.thumb,
                    lastMessage: '你们已成为好友，开始聊天吧~',
                    unRead: 0,
                    timeShown: now.getHours() + ':' + now.getMinutes(),
                    lastMsgType: 1,
                    pivot: pivot,
                };
            }
            app.globalData.sumUnRead -= app.globalData.chaters[that.data.chater.id].unRead;
            //当页面加载时，默认所有消息已被阅读
            await that.updateDbMessage2Read();
            //如果当前chater是第一次被访问，无全局数据，则获取数据库记录
            if (!app.globalData.chats.hasOwnProperty(that.data.chater.id)) {
                var res = await that.getChatHistory();
                if (res.data.length == 0) {
                    //建立聊天关系
                    var res = await that.addToUserChater();
                    if (res.code == 204) {

                    }
                }
                console.log('当前聊天对象：' + that.data.chater.id);
                //在全局chats数组中初始化与当前chater的聊天记录
                app.globalData.chats[that.data.chater.id] = res.data;
                //同时初始化当前page的聊天记录chats
                that.data.chats = res.data;
                // console.log('全局chats:' + JSON.stringify(app.globalData.chats));
            } else {
                //如果全局数据中有当前chater的数据，则直接渲染
                console.log('直接渲染与chater ' + that.data.chater.id + '的聊天记录');
                that.data.chats = app.globalData.chats[that.data.chater.id];
            }

            emojis.init(that);
            console.log('当前emoji类别：' + that.data.emojiIcons[0].type);
            that.scrollMessages();
            $digest(that);
        }
        catch (err) {
            console.log("+++2+++ error:", err)
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var that = this;
        //准备socket连接
        app.prepareSocket(null, true);
        wx.onSocketError(function (res) {
            console.log('Can not connet to websocket@' + api.ws_domain);
        });
        //当客户端接收到服务端的响应时，修改聊天记录
        wx.onSocketMessage(function (res) {
            that.onSocketMessage(res);
        });
        wx.onSocketClose(function (res) {
            that.onSocketClose(res);
        });
        that.data.innerAudioContext = wx.createInnerAudioContext();
        that.data.innerAudioContext.onEnded(function () {
            that.data.onOff = true;
            that.data.chats[that.data.index].is_play = false;
            that.setData({chats: that.data.chats});
        });
        that.scrollMessages();
    },
    //接收websocket服务器响应
    onSocketMessage: function (res) {
        console.log('page中的onSocketMessage');
        console.log(res.data);
        var data = JSON.parse(res.data);
        if (data.code == 200) {
            if (data.chat.type == 1) {
                data.chat.message = emojis.emojiParse(this.data._wxapp, data.chat.message);
            }
            data.chat.timeShown = data.chat.create_time.substring(11, 16);
            /* 更新当前页面聊天栈 */
            this.updateChats(data.chat);
            this.scrollMessages();
            /* 更新全局聊天栈 */
            this.updateGlobalChats(data.chat, true);
            /* 更新全局chaters中当前对象的lastMessage */
            this.updateGlobalChaters(data.chat, true);
            //更新全局chaters中当前对象unRead为0
            if (data.chat.send_uid == this.data.chater.id) {
                console.log('还停留在页面中并得到消息');
                this.updateDbMessage2Read();
                //此时无需更改全局sumUnRead
            } else {
                console.log('未在页面中，但得到消息');
                app.globalData.chaters[data.chat.send_uid].unRead++;
                app.globalData.sumUnRead++;
            }
        }
    },
    //websocket连接关闭处理
    onSocketClose: function (res) {
        console.log('websocket连接关闭');
        console.log(res);
        if (res.code == 1006) {
            wx.showToast({
                title: '与服务器断开连接',
                icon: 'none',
            })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        wx.setNavigationBarTitle({title: that.data.chater.name});
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log('hide page');
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log('unload page');
        this.data.chater.id = 0;
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {
        console.log('刷新数据');
        var chaters = app.globalData.chaters;
        var that = this;
        //下拉更新数据
        if (!chaters[that.data.chater.id].hasOwnProperty('page') || chaters[that.data.chater.id].page) {
            var res = await that.getPageChatHistory();
            if (res.code == 200) {
                //refresh page&global chats
                app.globalData.chats[that.data.chater.id] = res.data.concat(app.globalData.chats[that.data.chater.id]);
                that.setData({chats: res.data.concat(that.data.chats)});
                //refresh global chaters
                chaters[that.data.chater.id]['page'] = true;
            }
            //res.code==204,no page chat history
            if (res.code == 204) {
                console.log('No page data.');
                chaters[that.data.chater.id]['page'] = false;
            }
        }
        wx.stopPullDownRefresh();
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

    //获取页面所需数据
    async getPageData() {
        const res = await $request({url: api.user_info, data: {openid: this.data.userInfo.openId}, method: 'GET'});
        this.data.user = JSON.parse(res.data);
        console.log(this.data.user);
    }
});