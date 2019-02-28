<?php
namespace app\api\logic;

use WxPay\Notify;
use WxPay\WxPayData;
use WxPay\WxPayResults;

use think\Log;
use think\Db;
use app\api\logic\OrderRedis;
use app\common\model\FormIdCollection;
use app\common\model\WxTemplateMessage;

/**
 * 微信回调处理逻辑
 * @package app\halei\logic
 */
class WxPay
{
    public function handleNotify($xml = '')
    {
    	$notify = new Notify();
        $wxPayResults = new WxPayResults();
        //签名验证
        $data = $wxPayResults->Init($xml);

        Log::init(['type' => 'File', 'path' => ROOT_PATH . '/extend/pay_log/']);
        Log::write('支付回调参数:'.json_encode($data));

        if (empty($data)) 
        {
            //验证不通过返回
            $notify->NotifyReturn();
            die;
        }
        //验证通过返回
        $notify->NotifyReturn(true);

        //1.检查订单状态是否已支付
        // $order = OrderModel::detail(array('order_no' => $data['out_trade_no']));
        $order = Db::name('order')->where(['order_no' => $data['out_trade_no']])->find();

        if ($order['status'] == 2) 
        {
            die;
        }
        else
        {
            //修改订单状态
            // $order_model = new OrderModel();
            // $order_model->where(array('order_no' => $data['out_trade_no']))->update(array('status' => 1));
            $update['transaction_id'] = $data['transaction_id'];
            $update['status'] = 2;
            Db::name('order')->where(['order_no' => $data['out_trade_no']])->update($update);

            //重置缓存订单时间
            OrderRedis::resetOrder('user:' . $order['boss_uid'], 'order:' . $order['id']);

            //给陪玩师发送新订单通知推送
            $this->sendTemplateMessage($order);

        }

        // file_put_contents(ROOT_PATH.time().'++++'.$data['out_trade_no'].'.txt', $data);die;
        Log::write('支付成功订单号:'.$data['out_trade_no']);

    }

    public function sendTemplateMessage($order)
    {
        $templateId = "oou9hCHfxT94j_5507liqswrYZ72uEsqxKLIAki_q4c";
        $skill_name = Db::name('skill')->where(['id' => $order['sid']])->value('name');
        $openId = Db::name('user')->where(['id' => $order['play_uid']])->value('openid');
        $data = [
            'keyword1' => [
                'value' => $order['order_no'],
                'color' => '#173177'
            ],
            'keyword2' => [
                'value' => $skill_name,
                'color' => '#173177'
            ],
            'keyword3' => [
                'value' => date("Y-m-d H:i:s", time()),
                'color' => '#173177'
            ],
            'keyword4' => [
                'value' => $order['pay_total'] . '元',
                'color' => '#173177'
            ],
            'keyword5' => [
                'value' => "你有新的订单，请进入接单记录查看",
                'color' => '#173177'
            ]
        ];
        $collection = new FormIdCollection($openId);
        $formId = $collection->get(true);
        $sendRes = WxTemplateMessage::sendTemplateMessage($templateId, $formId, $openId, $data);

        // if ($sendRes->errcode == 0) {
        //     self::show(1, '模板发送成功', [$sendRes]);
        // } else {
        //     self::show(0, '模板发送失败', [$sendRes]);
        // }
    }

    
}
