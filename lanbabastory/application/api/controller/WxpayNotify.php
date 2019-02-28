<?php

namespace app\api\controller;

use app\api\service\WxPayNotifyHandler;

class WxpayNotify
{
    public function index()
    {
        //获取微信返回参数
        $xml = file_get_contents("php://input");
        //处理微信回调参数
        $wxPayLogic = new WxPayNotifyHandler();
        $wxPayLogic->handleNotify($xml);
    }
}