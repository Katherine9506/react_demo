<?php

namespace app\common\model;

use think\Model;

/**
 * Class Order 会员购买订单记录
 * @package app\common\model
 */
class Order extends Model
{
    protected $visible = ['id', 'order_no', 'transaction_id', 'user_id', 'member_id', 'amount', 'pay', 'expire_date', 'create_time'];
}