<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:84:"/home/deepin/Projects/php/waibao/Child-Music//themes/admin/album_category/index.html";i:1543199696;s:68:"/home/deepin/Projects/php/waibao/Child-Music//themes/admin/base.html";i:1543024942;}*/ ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>蓝爸爸讲故事</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link rel="stylesheet" href="__JS__/layui/css/layui.css" media="all">
    <link rel="stylesheet" href="__JS__/jedate/skin/jedate.css">
    <link rel="stylesheet" href="__CSS__/font-awesome.min.css">
    <!--CSS引用-->
    
    <link rel="stylesheet" href="__CSS__/admin.css">
    <!--[if lt IE 9]>
    <script src="__CSS__/html5shiv.min.js"></script>
    <script src="__CSS__/respond.min.js"></script>
    <![endif]-->
    <!--JS引用-->
    <style type="text/css">
    .tips{color:#555;}
    </style>
</head>
<body>
<div class="layui-layout layui-layout-admin">
    <!--头部-->
    <div class="layui-header header">
        <a style="display:inline-block;line-height:60px;text-align:center;width:180px;font-size:19px;color:#BBB;">蓝爸爸讲故事</a>
        <ul class="layui-nav" style="position: absolute;top: 0;right: 20px;background: none;">
            <li class="layui-nav-item"><a href="<?php echo url('/'); ?>" target="_blank">前台首页</a></li>
            <li class="layui-nav-item"><a href="" data-url="<?php echo url('admin/system/clear'); ?>" id="clear-cache">清除缓存</a></li>
            <li class="layui-nav-item">
                <a href="javascript:;"><?php echo session('admin_name'); ?></a>
                <dl class="layui-nav-child"> <!-- 二级菜单 -->
                    <dd><a href="<?php echo url('admin/change_password/index'); ?>">修改密码</a></dd>
                    <dd><a href="<?php echo url('admin/login/logout'); ?>">退出登录</a></dd>
                </dl>
            </li>
        </ul>
    </div>

    <!--侧边栏-->
    <div class="layui-side layui-bg-black">
        <div class="layui-side-scroll">
            <ul class="layui-nav layui-nav-tree">
                <li class="layui-nav-item">
                    <a href="<?php echo url('admin/index/index'); ?>"><i class="fa fa-home"></i> 网站信息</a>
                </li>
                <?php if(is_array($menu) || $menu instanceof \think\Collection || $menu instanceof \think\Paginator): if( count($menu)==0 ) : echo "" ;else: foreach($menu as $key=>$vo): if(isset($vo['children'])): ?>
                <li class="layui-nav-item">
                    <a href="javascript:;"><i class="<?php echo $vo['icon']; ?>"></i> <?php echo $vo['title']; ?></a>
                    <dl class="layui-nav-child">
                        <?php if(is_array($vo['children']) || $vo['children'] instanceof \think\Collection || $vo['children'] instanceof \think\Paginator): if( count($vo['children'])==0 ) : echo "" ;else: foreach($vo['children'] as $key=>$v): ?>
                        <dd><a href="<?php echo url($v['name']); ?>"> <?php echo $v['title']; ?></a></dd>
                        <?php endforeach; endif; else: echo "" ;endif; ?>
                    </dl>
                </li>
                <?php else: ?>
                <li class="layui-nav-item">
                    <a href="<?php echo url($vo['name']); ?>"><i class="<?php echo $vo['icon']; ?>"></i> <?php echo $vo['title']; ?></a>
                </li>
                <?php endif; endforeach; endif; else: echo "" ;endif; ?>
            </ul>
        </div>
    </div>

    <!--主体-->
    
<div class="layui-body">
    <!--tab标签-->
    <div class="layui-tab layui-tab-brief">
        <ul class="layui-tab-title">
            <li class="layui-this">专辑分类</li>
            <li class=""><a href="<?php echo url('admin/album_category/add'); ?>">添加分类</a></li>
        </ul>
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
                <table class="layui-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>分类名称</th>
                        <th>排序</th>
                        <th>状态</th>
                        <th style="width:90px;">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                        <?php if(count($list)): foreach($list as $item): ?>
                        <tr>
                            <td style="width: 30px;"><?php echo $item["id"]; ?></td>
                            <td><?php echo $item['title']; ?></td>
                            <td><?php echo $item["sort"]; ?></td>
                            <td><?php echo $statusList[$item["status"]]; ?></td>
                            <td>
                                <a href="<?php echo url('admin/album_category/edit', ['id' => $item['id']]); ?>" class="layui-btn layui-btn-normal layui-btn-mini">编辑</a>
                                <a href="<?php echo url('admin/album_category/del', ['id' => $item['id']]); ?>" class="layui-btn layui-btn-danger layui-btn-mini ajax-delete">删除</a>
                            </td>
                        </tr>
                        <?php endforeach; else: ?>
                        <tr>
                            <td colspan="8" align="middle">Sorry, 暂无数据</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>


</div>


<script>
var upload_image = "<?php echo url('upload/image'); ?>"; // 定义全局JS变量
var GV = {
    current_controller: "admin/<?php echo (isset($controller) && ($controller !== '')?$controller:''); ?>/",
    base_url: "__STATIC__"
};</script>
<script src="__JS__/jquery.min.js"></script>
<script src="__JS__/layui/lay/dest/layui.all.js"></script>
<script src="__JS__/jedate/jedate.min.js"></script>
<script src="__JS__/admin.js"></script>


<!--页面JS脚本-->


<script>

$(document).on("click", "[window]", function()
{
    var
    url     = $(this).attr("bind-url"),
    title   = $(this).attr("bind-title"),
    options =
    {
        type : 2,
        area : ["50%", "90%"],
        title : title,
        content : url,
        success : function(layero, index) {}
    };

    layui.layer.open(options);
});

</script>

</body>
</html>
