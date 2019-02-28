<?php
namespace app\api\controller;

use app\api\logic\WxPay as WxPayLogic;
use wxpay\NativeNotifyCallBack;

/**
 * 回调地址
 * @package app\halei\controller
 */
class Notify
{
    public function index()
    {
        //获取微信返回参数
        $xml = file_get_contents("php://input");
        //处理微信回调参数
        $wxPayLogic = new WxPayLogic();
        $wxPayLogic->handleNotify($xml);
    }
}
