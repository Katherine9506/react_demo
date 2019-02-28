<?php
/**
 * Created by PhpStorm.
 * User: 罗阁科技
 * Date: 2018/12/5
 * Time: 9:43
 */

namespace app\api\service;

use app\common\model\Order as OrderModel;
use think\Log;
use WxPay\Notify;
use WxPay\WxPayResults;

/**
 * Class WxPayNotifyHandler 微信支付回调处理逻辑
 * @package app\api\service
 */
class WxPayNotifyHandler
{
    public function handleNotify($xml = '')
    {
        $notify = new Notify();
        $wxPayResults = new WxPayResults();
        //签名验证
        $data = $wxPayResults->Init($xml);

        Log::init(['type' => 'File', 'path' => ROOT_PATH . '/extend/pay_log/']);
        Log::write('支付回调参数:' . json_encode($data));

        if (empty($data)) {
            //验证不通过返回
            $notify->NotifyReturn();
            die;
        }
        //验证通过返回
        $notify->NotifyReturn(true);

        //1.检查订单状态是否已支付
        $order = OrderModel::where('order_no', $data['out_trade_no'])->find();

        if ($order->transaction_id) {
            die;
        } else {
            //修改订单状态
            $order->isUpdate(true)->save([
                'transaction_id' => $data['transaction_id'],
            ]);
        }

        Log::write('支付成功订单号:' . $data['out_trade_no']);
    }
}