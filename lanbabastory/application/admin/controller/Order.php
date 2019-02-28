<?php

namespace app\admin\controller;

use app\common\model\Member as MemberModel;
use app\common\model\Order as OrderModel;
use think\Request;

class Order extends AdminBase
{
    /* 订单列表 */
    public function index(Request $request)
    {
        $orders = OrderModel::paginate(15, false, $request->param())->each(function ($order) {
            $order->member = MemberModel::get($order->member_id);
        });
        return view('index', compact('orders'));
    }

    /* 订单详情 */
    public function show(Request $request, $order_id)
    {
        if ($request->isAjax()) {
            $order = OrderModel::get($order_id);
            $order->member = MemberModel::get($order->member_id);
            return json($order);
        }
    }
}