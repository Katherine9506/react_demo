<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:57:"E:\repository\lanbabastory\/themes/admin/audio\index.html";i:1544067642;s:50:"E:\repository\lanbabastory\/themes/admin/base.html";i:1543373157;}*/ ?>
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
        .tips {
            color: #555;
        }
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
            <li class="layui-this">音频列表</li>
            <li class=""><a href="<?php echo url('admin/audio/add'); ?>">添加音频</a></li>
        </ul>
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
                <form action="<?php echo url('/admin/audio/search'); ?>" class="layui-form" method="post">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">搜索类型：</label>
                            <div class="layui-input-inline" style="width: 120px;">
                                <select name="searchType" lay-verify="required">
                                    <?php if(is_array($search_types) || $search_types instanceof \think\Collection || $search_types instanceof \think\Paginator): $i = 0; $__LIST__ = $search_types;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?>
                                    <option value="<?php echo $key; ?>" {if(isset($searchType) && $searchType== $key)}selected{
                                    /if}><?php echo $vo; ?></option>
                                    <?php endforeach; endif; else: echo "" ;endif; ?>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline" style="width:350px;">
                                <input type="text" value="<?php echo (isset($searchKey) && ($searchKey !== '')?$searchKey:''); ?>" name="searchKey" class="layui-input"
                                       placeholder="输入搜索内容">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div class="layui-input-inline">
                                <button class="layui-btn" lay-summit lay-filter="*">
                                    <icon class="layui-icon">&#xe615;</icon>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <table class="layui-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>名称</th>
                        <th>封面</th>
                        <th>VIP</th>
                        <th>时长</th>
                        <th>大小</th>
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
                        <td><img src="<?php echo $item['thumb']; ?>" width="40" height="40"/></td>
                        <td><?php echo $vipList[$item["is_vip"]]; ?></td>
                        <td><?php echo $item["duration"]; ?></td>
                        <td><?php echo $item["size"]; ?>B</td>
                        <td><?php echo $item["sort"]; ?></td>
                        <td><?php echo $statusList[$item["status"]]; ?></td>
                        <td>
                            <a href="<?php echo url('admin/audio/edit', ['id' => $item['id']]); ?>"
                               class="layui-btn layui-btn-normal layui-btn-mini">编辑</a>
                            <a href="<?php echo url('admin/audio/del', ['id' => $item['id']]); ?>"
                               class="layui-btn layui-btn-danger layui-btn-mini ajax-delete">删除</a>
                        </td>
                    </tr>
                    <?php endforeach; else: ?>
                    <tr>
                        <td colspan="20" align="middle">Sorry, 暂无数据</td>
                    </tr>
                    <?php endif; ?>
                    </tbody>
                </table>
                <?php echo $list->render(); ?>
            </div>
        </div>
    </div>
</div>


</div>


<script>
    var upload_image = "<?php echo url('upload/image'); ?>"; // 定义全局JS变量
    var upload_audio = "<?php echo url('upload/audio'); ?>"; // 定义全局JS变量
    var GV = {
        current_controller: "admin/<?php echo (isset($controller) && ($controller !== '')?$controller:''); ?>/",
        base_url: "__STATIC__"
    };
</script>
<script src="__JS__/jquery.min.js"></script>
<script src="__JS__/layui/lay/dest/layui.all.js"></script>
<script src="__JS__/jedate/jedate.min.js"></script>
<script src="__JS__/admin.js"></script>


<!--页面JS脚本-->


<script>

    $(document).on("click", "[window]", function () {
        var
            url = $(this).attr("bind-url"),
            title = $(this).attr("bind-title"),
            options =
                {
                    type: 2,
                    area: ["50%", "90%"],
                    title: title,
                    content: url,
                    success: function (layero, index) {
                    }
                };

        layui.layer.open(options);
    });

</script>

</body>
</html>
