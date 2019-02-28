<?php

namespace app\common\model;

use think\Model;

class User extends Model
{
    protected $visible = ['id', 'name', 'openid', 'avatar', 'is_member', 'sign_member', 'expire_date', 'create_time', 'phone'];

    const SEARCH_NICKNAME = 1;
    const SEARCH_UUID = 2;
    const SEARCH_PHONE = 3;
    const SEARCH_MEMBER = 4;
    const SEARCH_NOT_MEMBER = 5;
    const SEARCH_ALL = 6;
    const TYPE_OF_SEARCH = [
        self::SEARCH_NICKNAME => '昵称',
        self::SEARCH_UUID => '唯一标志',
        self::SEARCH_PHONE => '手机号',
        self::SEARCH_MEMBER => '会员',
        self::SEARCH_NOT_MEMBER => '非会员',
        self::SEARCH_ALL => '全部',
    ];

    const NORMAL = 0; //普通用户
    const VIP = 1;//会员用户

    const USER_DESC = [
        self::NORMAL => '普通用户',
        self::VIP => '会员用户'
    ];

    /* 会员购买记录 一对多*/
    public function orders()
    {
        return $this->hasMany('Order');
    }

    /* 签到记录 */
    public function signs()
    {
        return $this->hasMany('Sign');
    }

    /* 会员购买过的套餐列表 远程一对多 可以进行推荐使用*/
    public function members()
    {
        return $this->hasManyThrough('Member', 'Order');
    }
}