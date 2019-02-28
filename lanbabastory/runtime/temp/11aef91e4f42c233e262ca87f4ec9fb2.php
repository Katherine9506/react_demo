<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:82:"/home/deepin/Projects/php/waibao/Child-Music//themes/admin/system/site_config.html";i:1543227379;s:68:"/home/deepin/Projects/php/waibao/Child-Music//themes/admin/base.html";i:1543024942;}*/ ?>
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
    
<!--可使用规则:required,phone,url,number,date,identity,email-->
<form class="layui-form form-container" action="<?php echo url('admin/system/updateSiteConfig'); ?>" method="post">
<div class="layui-body">
    <!--tab标签-->
    <div class="layui-tab layui-tab-brief">
        <?php 
            $tabList = [
                "base" => "基础配置",
                "number" => "数字配置",
                "pay" => "支付配置",
                "seo" => "SEO优化",
                "sms" => "短信配置",
                "media" => "媒体配置"
            ];

            $tabName = array_keys($items);
         ?>
        <ul class="layui-tab-title">
            <?php foreach($tabName as $name): if(isset($tabList[$name])): ?>
            <li <?php if($name=="base"): ?>class="layui-this"<?php endif; ?>><?php echo $tabList[$name]; ?></li>
            <?php endif; endforeach; ?>
        </ul>
        <div class="layui-tab-content">
            <?php foreach($items as $name => $item): ?>
                <div class="layui-tab-item<?php if($name=='base'): ?> layui-show<?php endif; ?>">
                <?php foreach($item as $row): $extra = [];if(in_array($row['type'], [4,5,6]) && $row['extra'] != '')foreach(explode(',', $row['extra']) as $v){ list($k, $v) = explode(':', $v);$extra[$k] = $v; }; ?>
                <div class="layui-form-item">
                    <h2 style="font-weight:normal;font-size:14px;line-height:40px;color:#555;">
                        <?php echo $row['title']; ?>
                    </h2>
                    <div class="layui-input-block" style="margin-left:0;">
                        <?php switch($row['type']): case "1": ?>
                        <input type="text" name="<?php echo $row['name']; ?>" value="<?php echo $row['value']; ?>" autocomplete="off" class="layui-input" <?php if('' != $row['rule']): ?>lay-verify="<?php echo $row['rule']; ?>"<?php endif; ?>>
                        <?php break; case "7": ?>
                        <input type="password" name="<?php echo $row['name']; ?>" value="<?php echo $row['value']; ?>" autocomplete="off" class="layui-input" <?php if('' != $row['rule']): ?>lay-verify="<?php echo $row['rule']; ?>"<?php endif; ?>>
                        <?php break; case "2": ?>
                        <textarea name="<?php echo $row['name']; ?>" class="layui-textarea"><?php echo $row['value']; ?></textarea>
                        <?php break; case "3": ?>
                        <input type="text" class="layui-input" style="width:300px;display:inline-block;" readonly="true" name="<?php echo $row['name']; ?>" value="<?php echo $row['value']; ?>">
                        <input type="file" class="layui-upload-file" name="<?php echo $row['name']; ?>">
                        <?php if($row['value']): ?>
                        <br><br>
                        <img src="<?php echo $row['value']; ?>" width="120">
                        <?php endif; if('' != $row['value']): endif; break; case "4": foreach($extra as $k => $v): ?>
                        <label>
                            <input type="radio" name="<?php echo $row['name']; ?>" value="<?php echo $k; ?>" <?php if($row['value'] == $k)echo "checked='true'"; ?>>
                            <?php echo $v; ?>
                        </label>
                        <?php endforeach; break; endswitch; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="layui-form-item">
        <div class="layui-input-block" style="margin-left:10px;">
            <button class="layui-btn" lay-submit lay-filter="*">提交</button>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
        </div>
    </div>
</div>
</form>


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
