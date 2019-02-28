<?php

namespace app\api\service;

use app\common\model\Order as OrderModel;
use client\Curl;
use think\Config;
use think\Exception;
use WxPay\WxPayApp;

class WxAppService
{
    public $host = "https://api.weixin.qq.com";

    /* 登录凭证校验 */
    public function login($code)
    {
        $params = [
            'js_code' => $code,
            'appid' => Config::get('wechat.appid'),
            'secret' => Config::get('wechat.appsecret'),
            'grant_type' => 'authorization_code'
        ];
        return $this->get($params, $this->host . '/sns/jscode2session');
    }

    /* GET */
    protected function get(array $params, $host)
    {
        $curl = (new Curl())->cancelSSLVerify()->get($host, $params);

        if (false === ($result = $curl->response())) {
            throw new Exception($curl->error());
        }
        return json_decode($result);
    }

    /* 小程序支付 */
    public function pay(OrderModel $order)
    {
        $data = [
            "trade_no" => $order['order_no'],
            "timestamp" => time(),
            "openid" => $order['openid'],
            "host" => request()->ip(),
            "order" => $order['id'],
            "money" => $order['amount'] * 100,
            "remark" => "蓝爸爸讲故事",
        ];
        $result = (new WxPayApp())->send($data);
        /* 二次签名 */
        $paySign = md5("appId=" . $result['appId'] . "&nonceStr=" . $result['nonceStr'] . "&package=" . $result['package'] . "&signType=" . $result['signType'] . "&timeStamp=" . $result['timeStamp'] . "&key=" . $this->key);

        unset($result['paySign']);
        $result['paySign'] = strtoupper($paySign);

        return $result;
    }
}