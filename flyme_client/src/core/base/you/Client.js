import Kernel from "./Kernel";

export default function Client (props)
{
    this.kernel = new Kernel(props);
    return this;
}

Client.prototype.then = function (then)
{
    this.kernel.response(then);
    return this;
};

/**
 * 请求状态变化处理
 */
Client.prototype.state = function (state)
{
    if (typeof state === "function")
    {
        this.kernel.state(state);
    }

    return this;
};

Client.prototype.kernel = () =>
{
    return this.kernel;
};

/**
 * GET请求
 */
Client.get = function (url, props)
{
    let client = new Client(props);

    client.kernel.method("GET").request(url);

    return client;
};

/**
 * DELETE请求
 */
Client.delete = function (url, props)
{
    let client = new Client(props);

    client.kernel.method("DELETE").request(url);

    return client;
};

/**
 * POST请求
 */
Client.post = function (url, props)
{
    let client = new Client(props);

    client.kernel.method("POST").request(url);

    return client;
};

/**
 * PUT请求
 */
Client.put = function (url, props)
{
    let client = new Client(props);

    client.kernel.method("PUT").request(url);

    return client;
};

/**
 * PATCH请求
 */
Client.patch = function (url, props)
{
    let client = new Client(props);

    client.kernel.method("PATCH").request(url);

    return client;
};
