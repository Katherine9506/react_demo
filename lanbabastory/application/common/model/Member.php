<?php

namespace app\common\model;

use think\db\Query;
use think\Model;

/**
 * Class Member 会员套餐
 * @package app\common\model
 */
class Member extends Model
{
    protected $visible = ['id', 'title', 'duration', 'price', 'is_active', 'create_time', 'desc'];

    const STATUS_ACTIVE = 1;
    const STATUS_UNACTIVE = 0;

    public function scopeActive(Query $query)
    {
        $query->where('is_active', self::STATUS_ACTIVE);
    }
}