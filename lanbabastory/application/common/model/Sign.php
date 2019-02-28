<?php

namespace app\common\model;

use think\Model;

/**
 * Class Sign 用户签到
 * @package app\common\model
 */
class Sign extends Model
{
    const SIGN_EVER = 1;
    const SIGN_NEVER = 2;
    const SIGN_DISCRETE = 3;
    const SIGN_CONTINUOUS = 4;

    const _MEMBER_SIGN_DAYS = 7;//允许通过签到获得会员的签到天数
    const _MEMBER_SIGN_FREE_DAYS = 30;//免费会员天数

    const SIGNS = [
        self::SIGN_CONTINUOUS => '持续签到',
        self::SIGN_NEVER => '无签到记录',
        self::SIGN_DISCRETE => '不连续签到',
    ];

    protected $visible = ['id', 'user_id', 'sign_at'];
}