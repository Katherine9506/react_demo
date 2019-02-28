/*!
 * 异步数据操作
 * request.js
 */

//监听表单提交
$(document).on("submit", ".form", function()
{
    var object = $(this).serializeArray(), url = $(this).attr("action"), data = {};

    $(this).serializeArray().map(function (v, i, d)
    {
        data[v["name"]] = v["value"];
    });

    if(!object.length)
    {
        layer.msg("提交数据不能为空");
        return false;
    }

    $.post(url, data, function(res)
    {
        if("status" in res)
        {
            if(res.status)
            {
                layer.msg(res.info, function ()
                {
                    if("redirect" in res)
                    {
                        window.location.href = res.redirect;
                    }
                });
            }
            else
            {
                layer.msg(res.info);
            }
        }
    });

    return false;
}).on("click", "[get]", function()
{
    var url = $(this).attr("url");

    $.get(url, function(res)
    {
        if("status" in res)
        {
            if(res.status)
            {
                layer.msg(res.info, function ()
                {
                    if("redirect" in res)
                    {
                        window.location.href = res.redirect;
                    }
                });
            }
            else
            {
                layer.msg(res.info);
            }
        }
    }, "json");
});

