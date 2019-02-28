/**
 * 后台JS主入口
 */

var layer = layui.layer,
    element = layui.element(),
    laydate = layui.laydate,
    form = layui.form(),
    editor = layui.layedit;

//编辑器
var editor_index = editor.build("editor",
    {
        uploadImage:
            {
                url: upload_image
            }
    });

editor.sync(editor_index);

//验证规则
form.verify(
    {
        float: [/^\d*(\.\d+)*$/, '请输入有效小数'],
        money: [/^\d*(\.\d+)*$/, '请输入有效金额'],
        sort: [/^\d{1,3}$/, '排序值范围0-999'],
        name: [/^[a-z]+(_[a-z]+)*$/i, '标识不正确,标识由英文字母和下划线组成'],
    });

/**
 * AJAX全局设置
 */
$.ajaxSetup(
    {
        type: "post",
        dataType: "json"
    });

/**
 * 后台侧边菜单选中状态
 */
$('.layui-nav-item').find('a').removeClass('layui-this');
$('.layui-nav-tree').find('a[href*="' + GV.current_controller + '"]').parent().addClass('layui-this').parents('.layui-nav-item').addClass('layui-nav-itemed');

/**
 * 通用单图上传
 */
layui.upload({
    url: upload_image,
    type: 'image',
    ext: 'jpg|png|gif|bmp|jpeg',
    success: function (data, input) {
        console.log(data);
        if (data.code === 0) {
            $(input).parent().parent().prev().val(data.data.src);
        }
        else {
            layer.msg(data.msg);
        }
    }
});

/**
 * 音频上传
 */
layui.upload({
    elem: '.layui-upload-file.audio',
    url: upload_audio,
    type: 'audio',
    ext: 'mp3',
    success: function (res, input) {
        console.log(res);
        if (res.code === 0) {
            $(input).parent().parent().prev().val(res.data.src);
            $('input[name="duration"]').val(res.data.playtime);
            $('input[name="size"]').val(res.data.filesize);
            $('input[name="seconds"]').val(res.data.playSeconds);
        }
        else {
            layer.msg(res.msg);
        }
    },
});

/**
 * 通用日期时间选择
 */
$('.datetime').on('click', function () {
    laydate(
        {
            elem: this,
            istime: true,
            format: 'YYYY-MM-DD hh:mm:ss'
        })
});

/**
 * 通用表单提交(AJAX方式)
 */
form.on('submit(*)', function (data) {
    if ($("#editor").length) {
        //存在layui富文本
        $("#editor").val(editor.getContent(editor_index));
    }

    if ($("#ckeditor").length && "ckeditor" in window) {
        //更新元素
        window.ckeditor.updateElement();
    }

    $.ajax(
        {
            url: data.form.action,
            type: data.form.method,
            data: $(data.form).serialize(),
            success: function (info) {
                if (info.code === 1) {
                    layer.msg(info.msg, function () {
                        location.href = info.url;
                    });
                }
                else {
                    layer.msg(info.msg);
                }
            }
        });

    return false;
});

/**
 * 通用批量处理（审核、取消审核、删除）
 */
$('.ajax-action').on('click', function () {
    var _action = $(this).data('action');
    layer.open({
        shade: false,
        content: '确定执行此操作？',
        btn: ['确定', '取消'],
        yes: function (index) {
            $.ajax({
                url: _action,
                data: $('.ajax-form').serialize(),
                success: function (info) {
                    if (info.code === 1) {
                        setTimeout(function () {
                            location.href = info.url;
                        }, 1000);
                    }
                    layer.msg(info.msg);
                }
            });
            layer.close(index);
        }
    });

    return false;
});

/**
 * 通用全选
 */
$('.check-all').on('click', function () {
    $(this).parents('table').find('input[type="checkbox"]').prop('checked', $(this).prop('checked'));
});

/**
 * 通用加载页面
 */

$(".ajax-load").on("click", function () {
    var
        width = $(this).attr("w") || 630,
        height = $(this).attr("h") || 550,
        href = $(this).attr("href");

    layer.open({
        type: 2,
        title: false,
        area: [width + 'px', height + 'px'],
        shade: 0.8,
        closeBtn: 0,
        shadeClose: true,
        content: href
    });

    return false;
});

/**
 * 通用删除
 */
$('.ajax-delete').on('click', function () {
    var _href = $(this).attr('href');
    layer.open({
        shade: false,
        content: '确定删除？',
        btn: ['确定', '取消'],
        yes: function (index) {
            $.ajax({
                url: _href,
                type: "get",
                success: function (info) {
                    if (info.code === 1) {
                        setTimeout(function () {
                            location.href = info.url;
                        }, 1000);
                    }
                    layer.msg(info.msg);
                }
            });
            layer.close(index);
        }
    });

    return false;
});

/**
 * 通用GET
 */
$('.ajax-get').on('click', function () {
    var _href = $(this).attr('href');

    layer.open(
        {
            shade: false,
            content: '确定操作吗？',
            btn: ['确定', '取消'],
            yes: function (index) {
                $.ajax(
                    {
                        url: _href,
                        type: "get",
                        success: function (info) {
                            if (info.code === 1) {
                                setTimeout(function () {
                                    location.href = info.url;
                                }, 1000);
                            }

                            layer.msg(info.msg);
                        }
                    });

                layer.close(index);
            }
        });

    return false;
});

/**
 * 清除缓存
 */
$('#clear-cache').on('click', function () {
    var _url = $(this).data('url');
    if (_url !== 'undefined') {
        $.ajax({
            url: _url,
            success: function (data) {
                if (data.code === 1) {
                    setTimeout(function () {
                        location.href = location.pathname;
                    }, 1000);
                }
                layer.msg(data.msg);
            }
        });
    }

    return false;
});

$(document).on("click", "[audit]", function () {
    var url = $(this).attr("url"), title = $(this).attr("title");
    var option =
        {
            time: 0,
            content: "<textarea class='auditComment' placeholder='审核说明'></textarea>",
            btn: ['通过审核', '未通过审核'],
            yes: function (index) {
                layer.close(index);

                $.post(url, {audit: 1, comment: $(".auditComment").val()}, function (info) {
                    if (info.status === 1) {
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 1000);
                    }

                    layer.msg(info.msg);
                });
            },
            btn2: function (index) {
                $.post(url, {audit: 2, comment: $(".auditComment").val()}, function (info) {
                    if (info.status === 1) {
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 1000);
                    }

                    layer.msg(info.msg);
                });
            }
        };

    layer.msg(title || '审核', option);
});


$(document).on("click", "[confirm]", function () {
    var url = $(this).attr("url"), title = $(this).attr("title");
    var option =
        {
            time: 0,
            btn: ['通过审核', '未通过审核'],
            yes: function (index) {
                layer.close(index);

                $.post(url, {audit: 1}, function (info) {
                    if (info.status == 1 || info.code == 1) {
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 1000);
                    }

                    layer.msg(info.msg);
                });
            },
            btn2: function (index) {
                $.post(url, {audit: 2}, function (info) {
                    if (info.status == 1 || info.code == 1) {
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 1000);
                    }

                    layer.msg(info.msg);
                });
            }
        };

    layer.msg(title || '审核', option);
});
