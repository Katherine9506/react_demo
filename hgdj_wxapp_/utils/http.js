/*!
 * HTTP 请求组件 - http.js
 * @author:wuquanyao
 * @date:2018-03
 */

let 
http   = {},
header =
{
    "Cookie" : "JSESSIONID="+wx.getStorageSync("session_id")
};
// header =
// {
//     "ACCESS_TOKEN" : ""
// };

/**
 * GET请求
 * @param string   url     请求地址
 * @param object   data    请求参数
 * @param Function success 请求回调
 * @param string   title   请求提示语
 */
http.get = function(url, data, success, title)
{
    console.log("GET请求中:"+url, title);

    title = title || null;
    
    if(null !== title)
    {
        wx.showLoading({title : title || "请求中..."});
    }

    wx.request({
        url      : url,
        data     : data,
        dataType : "json",
        method   : "GET",
        header   : header,
        success  : function(res)
        {
            success && success(res);

            setTimeout(function(){
                wx.hideLoading();
            }, 50);
        },
        fail : function()
        {
            wx.hideLoading();

            wx.showModal(
            {
                title      : "通知",
                content    : "「航海教育」网络异常，稍后再试~",
                showCancel : false,
                success    : function()
                {
                    
                },
                fail : function()
                {
                    
                }
            });
        }
    });
};

/**
 * GET请求(带有导航加载圈的请求)
 * @param string   url     请求地址
 * @param object   data    请求参数
 * @param Function success 请求回调
 * @param string   title   请求提示语
 */
http.get_load = function(url, data, success, title)
{
    console.log("LOAD_GET请求中:"+url, title);

    wx.request({
        url      : url,
        data     : data,
        dataType : "json",
        method   : 'GET',
        header   : header,// 设置请求的 header
        // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function(res)
        {
            // success
            success && success(res);

            // let data = res.data.result;
            // that.setData({list_pic:data});
        },
        fail: function() 
        {
            // fail
            wx.showModal(
            {
                title      : "通知",
                content    : "「航海教育」网络异常，稍后再试~",
                showCancel : false,
                success    : function()
                {
                    
                },
                fail : function()
                {
                    
                }
            });
        },
        complete: function() 
        {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }
    }) 
};

/**
 * POST请求
 * @param string   url     请求地址
 * @param object   data    请求参数
 * @param Function success 请求回调
 * @param string   title   请求提示语
 */
http.post = function(url, data, success, title)
{
    console.log("POST请求中:"+url);

    title = title || null;

    if(null !== title)
    {
        wx.showLoading({title : title || "提交中..."});
    }

    wx.request(
    {
        url      : url,
        data     : data,
        dataType : "json",
        method   : "POST",
        header   : header,
        success  : function(res)
        {
            console.log(res);

            setTimeout(function()
            {
                wx.hideLoading();

                if(null !== title)
                {
                    let title = ("info" in res["data"]) ? res["data"]["info"] : "提交成功";

                    wx.showToast({title : title, icon : "success"});
                }

                setTimeout(function()
                {
                    wx.hideToast();

                    success && success(res);
                }, 50);
            }, 50);
        },
        fail : function()
        {
            wx.hideLoading();

            wx.showModal(
            {
                title      : "通知",
                content    : "「嗨狗电竞」网络异常，稍后再试~",
                showCancel : false,
                success    : function()
                {
                    
                },
                fail : function()
                {
                    
                }
            });
        }
    });
};

/**
 * 下载文件
 * @param string src
 */
http.download = function(src, success, fail)
{
    wx.downloadFile({
        url : src,
        success : function(res)
        {
            console.log(res);
        },
        fail : function ()
        {

        }
    });
};

//暴露接口
module.exports = http;
