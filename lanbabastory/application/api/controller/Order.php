<?php

namespace app\api\controller;

use app\api\service\WxAppService;
use app\common\model\Member as MemberModel;
use app\common\model\Order as OrderModel;
use app\common\model\User as UserModel;
use think\Request;

class Order extends BaseController
{
    public function __construct(Request $request)
    {
        parent::__construct($request);
        Request::instance()->bind('user', UserModel::get($request->param('uuid')));
    }

    /* 添加订单 */
    public function create(Request $request, UserModel $user)
    {
        $postData = $request->post();
        /* check该用户是否有未支付订单 */
        $user->orders()->whereNull('transaction_id')->delete();
        /* 会员套餐价格 */
        $member = MemberModel::get($postData['member_id']);
        $expire_date = !$user->expire_date ? date('Y-m-d', strtotime('+' . $member->duration . ' day')) : date('Y-m-d', strtotime('+' . $member->duration . ' day', strtotime($user->expire_date)));
        $data = [
            'id' => create_uuid(),
            'order_no' => makeOrderNo(),
            'user_id' => $user->id,
            'member_id' => $member->id,
            'amount' => $member->price,
            'openid' => $user->openid,
            'expire_date' => $expire_date
        ];
        $order = OrderModel::create($data);
        return $this->successJson($order, '订单创建成功');
    }

    /* 支付订单 */
    public function pay(Request $request, UserModel $user)
    {
        $order_id = $request->post('order_id');
        $order = OrderModel::get($order_id);
        $res = (new WxAppService())->pay($order);
        /* 同步更新用户会员状态和会员过期日期 */
//        $user->isUpdate(true)->save(['expire_date' => $expire_date]);
    }
}