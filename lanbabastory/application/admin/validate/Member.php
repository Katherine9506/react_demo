<?php

namespace app\admin\validate;

use think\Validate;

class Member extends Validate
{
    protected $rule = [
        'title' => 'require',
        'duration' => 'require',
        'price' => 'require',
    ];
    protected $message = [
        'title.require' => '请输入套餐标题',
        'duration.require' => '请输入套餐时长',
        'price.require' => '请输入套餐价格',
    ];
}