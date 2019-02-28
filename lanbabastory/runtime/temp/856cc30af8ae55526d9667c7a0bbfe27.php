<?php if (!defined('THINK_PATH')) exit(); /*a:2:{s:56:"E:\repository\lanbabastory\/themes/admin/audio\save.html";i:1544088203;s:50:"E:\repository\lanbabastory\/themes/admin/base.html";i:1543373157;}*/ ?>
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
            <li class=""><a href="<?php echo url('admin/audio/index'); ?>">音频列表</a></li>
            <li class="layui-this">
                <?php if(request()->action() == "add"): ?>
                添加音频
                <?php else: ?>
                编辑音频
                <?php endif; ?>
            </li>
        </ul>
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
                <?php if(request()->action() == "add"): ?>
                <form class="layui-form form-container" action="<?php echo url('admin/audio/add'); ?>" method="post">
                    <?php else: ?>
                    <form class="layui-form form-container" action="<?php echo url('admin/audio/edit'); ?>" method="post">
                        <input type="hidden" name="id" value="<?php echo $detail['id']; ?>">
                        <?php endif; ?>
                        <div class="layui-form-item">
                            <label class="layui-form-label">音频名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="title" value="<?php echo (isset($detail['title']) && ($detail['title'] !== '')?$detail['title']:''); ?>" required
                                       lay-verify="required" placeholder="请输入音频名称名称" class="layui-input">
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label">音频分类</label>
                            <div class="layui-input-block">
                                <select class="layui-select" name="cid" lay-verify="required">
                                    <option value="">选择分类</option>
                                    <?php foreach($category as $item): ?>
                                    <option value="<?php echo $item['id']; ?>" <?php if((isset($detail) && $detail[
                                    'cid'] == $item['id'])): ?>selected<?php endif; ?>><?php echo $item['title']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label">音频封面</label>
                            <div class="layui-input-block">
                                <div class="layui-input-inline">
                                    <?php if((isset($detail) && $detail['thumb'])): ?>
                                    <img src="<?php echo $detail['thumb']; ?>" width="190px">
                                    <?php endif; ?>
                                </div>
                                <input type="text" name="thumb" value="<?php echo (isset($detail['thumb']) && ($detail['thumb'] !== '')?$detail['thumb']:''); ?>" required
                                       lay-verify="required" placeholder="请上传音频封面"
                                       class="layui-input layui-input-inline">
                                <input type="file" name="file" class="layui-upload-file">
                            </div>
                        </div>


                        <div class="layui-form-item">
                            <label class="layui-form-label">音频文件</label>
                            <?php if((isset($detail) && $detail['audio'] != '')): ?>
                            <div class="layui-input-block">
                                <audio controls="controls" src="<?php echo $detail['audio']; ?>" type="audio/mpeg">您的浏览器不支持</audio>
                            </div>
                            <?php endif; ?>
                            <div class="layui-input-block">
                                <input type="text" name="audio" value="<?php echo (isset($detail['audio']) && ($detail['audio'] !== '')?$detail['audio']:''); ?>" required readonly
                                       lay-verify="required" placeholder="请上传MP3音频文件"
                                       class="layui-input layui-input-inline">
                                <input type="file" name="file" class="layui-upload-file audio">
                                <label class="layui-form-label">音频时长</label>
                                <input type="text" readonly name="duration" class="layui-input layui-input-inline"
                                       value="<?php echo !empty($detail)?$detail['duration']:'00:00'; ?>">
                                <input type="text" hidden name="size" value="<?php echo !empty($detail)?$detail['size']:0; ?>">
                                <input type="text" hidden name="seconds" value="<?php echo !empty($detail)?$detail['seconds']:0; ?>">
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label">音频简介</label>
                            <div class="layui-input-block">
                                <input type="text" name="breif" value="<?php echo (isset($detail['breif']) && ($detail['breif'] !== '')?$detail['breif']:''); ?>" required
                                       lay-verify="required" placeholder="音频介绍(20字以内)"
                                       class="layui-input layui-input-inline">
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label">降序排序</label>
                            <div class="layui-input-block">
                                <input type="text" name="sort" value="<?php echo (isset($detail['sort']) && ($detail['sort'] !== '')?$detail['sort']:'0'); ?>" required
                                       lay-verify="sort" class="layui-input">
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label">具体描述</label>
                            <div class="layui-input-block">
                                <textarea name="introduce" cols="30" rows="7"
                                          class="layui-textarea" required value="124555"
                                          lay-verify="required"
                                          placeholder="输入音频具体描述信息"><?php echo (isset($detail['introduce'] ) && ($detail['introduce']  !== '')?$detail['introduce'] :''); ?></textarea>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label">播放权限</label>
                            <div class="layui-input-block">
                                <?php foreach($vipList as $k => $v): ?>
                                <input type="radio" name="is_vip" value="<?php echo $k; ?>" title="<?php echo $v; ?>" <?php if((!isset($detail['is_vip'])
                                && $k==0) || (isset($detail['is_vip']) && $detail['is_vip'] == $k)): ?>checked="true"<?php endif; ?>>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label class="layui-form-label">发布状态</label>
                            <div class="layui-input-block">
                                <?php foreach($statusList as $k => $v): ?>
                                <input type="radio" name="status" value="<?php echo $k; ?>" title="<?php echo $v; ?>" <?php if((!isset($detail['status'])
                                && $k==1) || (isset($detail['status']) && $detail['status'] == $k)): ?>checked="true"<?php endif; ?>>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <div class="layui-input-block">
                                <button class="layui-btn" lay-submit lay-filter="*">保存</button>
                                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                            </div>
                        </div>
                    </form>
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
