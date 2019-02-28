/*!
 * XMLHttpRequest Level2 实现
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
 * @see http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
 */

export default function Kernel (props)
{
    if (!window.XMLHttpRequest)
    {
        throw new Error ("您的浏览器不支持XMLHttpRequest,推荐使用谷歌浏览器！");
    }

    this.xhr = new XMLHttpRequest();

    this.initialize(props);
}

Kernel.kv = (data) =>
{
    if(typeof data === "object")
    {
        let qs = [];

        for(let key in data)
        {
            qs.push(key + "=" + data[key]);
        }

        data = qs.join("&");
    }

    return data || null;
};

Kernel.prototype.props =
{
    /*请求数据*/
    data : {},
    /*查询参数*/
    query : {},
    /*响应数据类型*/
    dataType : "json",/*text/json/html/xml*/
    /*请求方法*/
    method : "GET",
    /*请求超时时间,单位毫秒*/
    timeout : 5000,
    /*请求头信息*/
    headers :
    {
        "content-type" : "application/x-www-form-urlencoded",
        "x-requested-with" : "XMLHttpRequest",
        "token" : new Date().getTime()
    },
    /**
     *  跨域请求是否提供凭据(cookie、HTTP认证及客户端SSL证明等)
     *  https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials
     */
    withCredentials : false,
    /*是否异步执行*/
    async : true,
    /*监听事件*/
    events : {
        "abort" : function (xhr, event) {},
        "error" : function (xhr, event) {},
        "load" : function (xhr, event) {},
        "loadstart" : function (xhr, event) {},
        "loadend" : function (xhr, event) {},
        "progress" : function (xhr, event) {},
        "timeout" : function (xhr, event) {},
    }, /*abort/error/load/loadend/loadstart/progress/timeout*/
    /*状态监听*/
    state : function (state) {},
    /*响应处理*/
    response : [],
};

/**
 * 属性初始化
 */
Kernel.prototype.initialize = function (props)
{
    for (let name in props)
    {
        if (props.hasOwnProperty(name) && this.props.hasOwnProperty(name))
        {
            switch (name)
            {
                case "data" : this.data(props[name]); break;
                case "dataType" : this.dataType(props[name]); break;
                case "method" : this.method(props[name]); break;
                case "timeout" : this.timeout(props[name]); break;
                case "headers" : this.headers(props[name]); break;
                case "async" : this.async(props[name]); break;
                case "events" : this.events(props[name]); break;
                case "state" : this.state(props[name]); break;
                case "query" : this.query(props[name]); break;
                case "withCredentials" : this.withCredentials(props[name]); break;
                default:break;
            }
        }
    }

    return this;
};

/**
 * 设置请求方法
 */
Kernel.prototype.method = function (method)
{
    if (-1 < ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].indexOf(method))
    {
        this.props.method = method;
    }

    return this;
};

/**
 * 设置请求数据
 */
Kernel.prototype.data = function (data)
{
    if (typeof data === "object")
    {
        Object.assign(this.props.data, data);
    }

    return this;
};

/**
 * 设置查询参数
 */
Kernel.prototype.query = function (query)
{
    if (typeof query === "object")
    {
        Object.assign(this.props.query, query);
    }

    return this;
};

/**
 * 设置请求超时时间
 */
Kernel.prototype.timeout = function (timeout)
{
    if (typeof timeout === "number")
    {
        this.props.timeout = timeout;
    }

    return this;
};

/**
 * 设置是否异步
 */
Kernel.prototype.async = function (async)
{
    if (typeof async === "boolean")
    {
        this.props.async = async;
    }

    return this;
};

/**
 * 设置withCredentials
 */
Kernel.prototype.withCredentials = function (withCredentials)
{
    if (typeof withCredentials === "boolean")
    {
        this.props.withCredentials = withCredentials;
    }

    return this;
};

/**
 * 设置响应数据类型
 */
Kernel.prototype.dataType = function (dataType)
{
    if (-1 < ["json", "text", "html", "xml"].indexOf(dataType))
    {
        this.props.dataType = dataType;
    }

    return this;
};

/**
 * 设置请求头信息
 */
Kernel.prototype.headers = function (headers)
{
    if (typeof headers === "object")
    {
        for (let name in headers) if (headers.hasOwnProperty(name)) this.props.headers[name.toLowerCase()] = headers[name];
    }

    return this;
};

/**
 * 请求过程监听
 */
Kernel.prototype.state = function (state)
{
    if (typeof state === "function")
    {
        this.props.state = state;
    }

    return this;
};

/**
 * 响应处理
 */
Kernel.prototype.response = function (response)
{
    if (typeof response === "function")
    {
        this.props.response.push(response);
    }

    return this;
};


/**
 * 批量请求事件
 */
Kernel.prototype.events = function (events)
{
    if (typeof events === "object")
    {
        for (let name in events)
        {
            name = name.toLowerCase();

            if (undefined !== this.xhr["on"+name] && typeof events[name] === "function")
            {
                this.props.events["on"+name] = events[name];
            }
        }
    }

    return this;
};

/**
 * 请求终止处理
 */
Kernel.prototype.abort = function (abort)
{
    if (typeof abort === "function") this.props.events["onabort"] = abort;

    return this;
};


/**
 * 请求超时处理
 */
Kernel.prototype.timeout = function (timeout)
{
    if (typeof timeout === "function") this.props.events["ontimeout"] = timeout;

    return this;
};

/**
 * 请求错误处理
 */
Kernel.prototype.error = function (error)
{
    if (typeof error === "function") this.props.events["onerror"] = error;

    return this;
};

/**
 * 当一个资源及其依赖资源已完成加载时，将触发load事件。
 */
Kernel.prototype.load = function (load)
{
    if (typeof load === "function") this.props.events["onload"] = load;

    return this;
};

/**
 * 程序开始加载
 */
Kernel.prototype.loadstart = function (loadstart)
{
    if (typeof loadstart === "function") this.props.events["onloadstart"] = loadstart;

    return this;
};

/**
 * 当一个资源的加载进度停止之后被触发,如，在已经触发“error”，“abort”或“load”事件之后
 */
Kernel.prototype.loadend = function (loadend)
{
    if (typeof loadend === "function") this.props.events["onloadend"] = loadend;

    return this;
};

/**
 * 加载进度
 */
Kernel.prototype.progress = function (progress)
{
    if (typeof progress === "function") this.props.events["onprogress"] = progress;

    return this;
};

/**
 * 发生请求
 */
Kernel.prototype.request = function (url)
{
    let queryString = Kernel.kv(this.props.query);

    if (null !== queryString)
    {
        if (-1 === url.indexOf("?")) url += "?" + queryString; else url += "&"+ queryString;
    }

    this.xhr.onreadystatechange = () =>
    {
        this.props.state(this.xhr.readyState);

        if (XMLHttpRequest.DONE === this.xhr.readyState) for (let i in this.props.response) if (false === this.props.response[i]({
            status:this.xhr.status,
            statusText:this.xhr.statusText,
            result:this.xhr.response || {}
        })) break;
    };

    this.xhr.open(this.props.method, url, this.props.async);

    for (let event in this.props.events)
    {
        if (this.props.events.hasOwnProperty(event)) this.xhr[event] = this.props.events[event];
    }

    for (let key in this.props.headers)
    {
        if (this.props.headers.hasOwnProperty(key)) this.xhr.setRequestHeader(key, this.props.headers[key]);
    }

    if (this.props.dataType === "xml")
    {
        this.xhr.overrideMimeType("text/xml");
        this.xhr.responseType = "document";
    }
    else if (this.props.dataType === "html")
    {
        this.xhr.overrideMimeType("text/html");
        this.xhr.responseType = "document";
    }
    else
    {
        this.xhr.responseType = this.props.dataType;
    }

    this.xhr.timeout         = this.props.timeout;
    this.xhr.withCredentials = this.props.withCredentials;

    this.xhr.send(-1 === ["GET", "DELETE"].indexOf(this.props.method) ? Kernel.kv(this.props.data) : null);
};

