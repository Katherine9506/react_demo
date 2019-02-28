// import io from './lib/socket.io/weapp.socket.io'
const {regeneratorRuntime} = global
import {setLoginUrl} from './lib/page.auth'

global.regeneratorRuntime = require('./lib/regenerator/runtime-module')

let api = require('/utils/api.js');
let emojis = require('/emoji/emoji');

App({
    globalData: {
        unionId: 0,
        user: {},
        hasUser: false,
        //socket连接
        socketConnect: false,
        //socket连接打开
        socketOpen: false,
        //全局chats记录 chats=[chater_id=>[ ]]
        chats: {},
        //全局聊天对象
        chaters: {},
        timer: 0,
        websocket: null,
        sumUnRead: 0,//未读总记录数
    },
    /**
     * 每个需要建立socket连接的页面都需要调用此方法，避免多次建立socket，导致连接失败
     * @param callback 传入回调，利用回调在websocket非平滑重启的时候重连，并发出消息
     */
    prepareSocket: function (send = null, page = false) {
        var that = this;
        if (!that.globalData.socketOpen) {
            this.globalData.websocket = wx.connectSocket({
                url: api.ws_domain,
                success: function (res) {
                    that.globalData.socketConnect = true;
                }
            });
        }
        this.globalData.websocket.onOpen(function (res) {
            that.globalData.socketOpen = true;
            console.log('Page onready, send to and receive from server:');
            if (send) {
                send();
            }
        });
        if (!page) {
            wx.onSocketMessage(function (res) {
                console.log('app中的onSocketMessage');
                that.onSocketMessage(res);
            })
        }
    },
    keepAlive: function () {
        console.log('保持活性连接...');
        if (this.globalData.socketOpen) {
            let msg = {
                message: 'Keep live.',
                is_keep_live: true
            };
            this.globalData.websocket.send({
                data: JSON.stringify(msg),
                success: function (res) {
                    console.log('发送数据成功');
                }
            });
        }
    },
    //接收websocket服务器响应
    onSocketMessage: function (res) {
        var data = JSON.parse(res.data);
        if (data.code == 200) {
            if (data.chat.type == 1) {
                data.chat.message = emojis.emojiParse(api.oss_domain + '/upload/wxapp', data.chat.message);
            }
            this.updateGlobalChats(data.chat);
            this.updateGlobalChaters(data.chat);
            this.globalData.sumUnRead++;
            this.updateTabBarBadeg();
        }
    },
    /* 更新全局聊天栈 */
    updateGlobalChats: function (data) {
        var chats = this.globalData.chats;
        data.timeShown = data.create_time.substring(11, 16);
        if (!chats.hasOwnProperty(data.send_uid)) {
            chats[data.send_uid] = [data];
        } else {
            chats[data.send_uid].push(data);
        }
        this.globalData.chats = chats;
    },
    /* 更新全局chaters中当前对象的lastMessage */
    updateGlobalChaters: function (data) {
        var chaters = this.globalData.chaters;
        data.create_time = data.create_time.substring(11, 16);
        if (!chaters.hasOwnProperty(data.send_uid)) {
            console.log('新增聊天对象');
            console.log(data);
            var pivot = {chater_id: data.send_uid};
            this.globalData.chaters[data.send_uid] = {
                name: data.sendUser.name,
                thumb: data.sendUser.thumb,
                lastMessage: data.message,
                unRead: 1,
                timeShown: data.create_time,
                lastMsgType: data.type,
                pivot: pivot,
            };
        } else {
            this.globalData.chaters[data.send_uid].lastMessage = data.message;
            this.globalData.chaters[data.send_uid].unRead++;
            this.globalData.chaters[data.send_uid].timeShown = data.create_time.substring(11, 16);
        }
    },
    onSocketClose: function () {
    },
    updateTabBarBadeg: function () {
        if (this.globalData.sumUnRead > 0) {
            wx.setTabBarBadge({
                index: 2,
                text: '' + this.globalData.sumUnRead,
            });
        } else {
            wx.removeTabBarBadge({
                index: 2,
            })
        }
    },
    onLaunch(options) {
        setLoginUrl(api.login);

        this.auth();
    },
    onShow(options) {
        // wx.hideTabBar({})
        this.auth();
        this.globalData.timer = setInterval(this.keepAlive, 40 * 1000);
    },

    onHide() {

    },

    onError(msg) {
        console.error("[APP ERROR]", msg)
    },

    auth() {
        // 查看是否授权
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
                else {
                    // 未授权，跳转到授权页面
                    wx.reLaunch({
                        url: '/pages/auth/auth',
                    })
                }
            }
        })
    },
    userInfoReadyCallback: function (res) {
        console.log('获取用户信息回调');
        console.log(res);

    }
})