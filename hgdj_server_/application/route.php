<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

return [
    '__pattern__' => [
        'name' => '\w+',
    ],
    '[hello]'     => [
        ':id'   => ['index/hello', ['method' => 'get'], ['id' => '\d+']],
        ':name' => ['index/hello', ['method' => 'post']],
    ],

    '/'       => 'index/index?current=1',
    'news'    => 'article/index?type=news&current=2',//新闻资讯
    'news_detail' => 'article/show?current=2',
    'active'  => 'article/index?type=active&current=3',//活动剪影
    'photos'  => 'article/index?type=photos&current=4',//相关照片
    'enjoy'   => 'article/index?type=enjoy&current=5',//作品欣赏
    'article' => 'article/index?type=article&current=6',//评论文章
    'diploma' => 'article/index?type=diploma&current=7',//个人证书
    'contact' => 'article/single?type=contact&current=8',//联系我们

];
