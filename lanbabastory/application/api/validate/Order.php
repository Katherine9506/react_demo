<?php

namespace app\api\validate;

use think\Validate;

class Order extends Validate
{
    protected $rule = [
        'transaction_id' => 'require',
        'user_id' => 'require',
        'member_id' => 'require',
        'amount' => 'require',
        'pay' => 'require'
    ];

    protected $message = [
        'transaction_id.require' => '支付流水号',
        'user_id.require' => '购买会员的用户',
        'member_id.require' => '会员套餐',
        'amount.require' => '订单金额',
        'pay.require' => '支付金额',
    ];
}