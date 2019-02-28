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

namespace app\common\model;

use think\Model;

class UserSkills extends Model
{
    const STATUS_CHECK_PASSED = 1;
    const STATUS_CHECK_WAITED = 0;
    const STATUS_CHECK = [
        self::STATUS_CHECK_WAITED => '待审核',
        self::STATUS_CHECK_PASSED => '已审核',
    ];

    public function scopeOfStatus($query, $status)
    {
        if (!key_exists($status, self::STATUS_CHECK)) {
            return $query;
        }
        return $query->where('status', $status);
    }
}