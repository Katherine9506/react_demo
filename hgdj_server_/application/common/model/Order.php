<?php
// +----------------------------------------------------------------------
// | Tplay [ WE ONLY DO WHAT IS NECESSARY ]
// +----------------------------------------------------------------------
// | Copyright (c) 2018 http://tplay.pengyichen.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: yuanyuan < 38625673@qq.com >
// +----------------------------------------------------------------------

namespace app\common\model;

use think\db\Query;
use think\Model;

class Order extends Model
{
    protected $type = [
        'figure_imgs' => 'array'
    ];

    const STATUS_UNPAID = 1;
    const STATUS_UNTAKE = 2;
    const STATUS_UNSTART = 3;
    const STATUS_PLAYING = 4;
    const STATUS_UNCHECK = 5;
    const STATUS_UNCOMMENT = 6;
    const STATUS_COMMENTED = 7;
    const STATUS_CANCLED_UNPAID = 8;
    const STATUS_CANCLED_PAID = 9;

    const TYPE_STAUTS = [
        self::STATUS_UNPAID => '待支付',
        self::STATUS_UNTAKE => '等待接单',
        self::STATUS_UNSTART => '等待开始',
        self::STATUS_PLAYING => '陪玩中',
        self::STATUS_UNCHECK => '等待验收',
        self::STATUS_UNCOMMENT => '待评价',
        self::STATUS_COMMENTED => '已评价',
        self::STATUS_CANCLED_UNPAID => '已取消未支付订单',
        self::STATUS_CANCLED_PAID => '已取消支付订单',
    ];

    /**
     * @param $query Query
     */
    public function scopeComplete($query, $user_id)
    {
        $query->where('play_uid', $user_id)->whereIn('status', [self::STATUS_UNCOMMENT, self::STATUS_COMMENTED]);
    }

    /**
     * @param $query Query
     * @param $user_id
     */
    public function scopeRated($query, $user_id)
    {
        $query->where('play_uid', $user_id)->where('status', self::STATUS_COMMENTED);
    }
}