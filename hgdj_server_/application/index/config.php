<?php
// +----------------------------------------------------------------------
// | Tplay [ WE ONLY DO WHAT IS NECESSARY ]
// +----------------------------------------------------------------------
// | Copyright (c) 2018 http://tplay.pengyichen.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 听雨 < 389625819@qq.com >
// +----------------------------------------------------------------------


//配置文件
return [
	'view_replace_str' => [
		'__CSS__'      => '/static/index/css',
		'__PUBLIC__'   => '/static/public',
		'__JS__'       => '/static/index/js',
		'__IMG__'      => '/static/index/img'
	],

	'template'               => [
	    // 模板引擎类型 支持 php think 支持扩展
	    'type'         => 'Think',
	    // 模板路径
	    'view_path'    => 'template/index/',
	    // 模板后缀
	    'view_suffix'  => 'html',
	],

	//第三方登录
	'thirdlogin'	=>[
		'qq'        => [
		'appid'     => '',
		'appsecret' =>'',
		'callback'  =>'',
		]
	],
];