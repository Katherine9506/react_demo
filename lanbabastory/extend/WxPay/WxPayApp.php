<?php
/**
 * 支付模型
 * ALIPayModel class file.
 * @author wuquanyao
 * @link http://www.jinmi.com
 * @copyright Copyright &copy; 2016 AnHui JinMi Technology Co., Ltd
 */

namespace WxPay;

use WxPay\WxPayData;

define("NoticeUrl", $_SERVER["HTTP_HOST"] . "/wxNotice.html");

class WxPayApp
{
    //交易类型,Native/JSAPI/APP
    protected $trade_type = "JSAPI";

    //通知地址
    protected $notice_url = NoticeUrl;

    //构造函数
    public function __construct()
    {

    }

    /**
     * 二维码模式二,remark,order,money,tags,goods_id
     * @param array $data 支付数据
     * @param boolean $debug 是否调试
     */
    public function send($data = [], $debug = false)
    {
        if (isset($data["money"])) {
            //金额必须整数
            $data["money"] = (int)$data["money"];
        }

        $input = new WxPayUnifiedOrder();
        //商品描述
        $input->SetBody("蓝爸爸讲故事");
        $input->SetAttach("微信小程序");
        //小程序生成的支付id
        $input->SetOut_trade_no($data['trade_no']);
        //支付金额
        $input->SetTotal_fee($data['money']);
        // $input->SetTotal_fee(0.01*100);

        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 1800));
        // $input->SetGoods_tag("test3");
        $input->SetNotify_url(request()->domain() . "/api/wxpay_notify/index.html");
        // $input->SetNotify_url("http://tp.hfafq.com/");
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($data['openid']);
        $order = WxPayApi::unifiedOrder($input);

        //参数转换成json
        $tools = new JsApiPay();
        $jsApiParameters = $tools->GetJsApiParameters($order);
        $res = json_decode($jsApiParameters, true);

        return $res;
    }

    //订单通知
    public function notice()
    {
        (new NativeNotifyCallBack())->Handle(true);
    }
}

class NativeNotifyCallBack extends WxPayNotify
{
    //支付通知
    public function NotifyProcess($data, &$msg)
    {
        file_put_contents(ROOT_PATH . 'a.txt', $data);
        // out_trade_no, attach

        //已经支付
        //       if($this->getOrderStatus($data["out_trade_no"], $data["attach"]) === true)
        //       {
        //           return true;
        //       }

        // if(!array_key_exists("openid", $data) || !array_key_exists("product_id", $data))
        // {
        // 	//回调数据异常
        // 	return false;
        // }

        // $openid = $data["openid"];
        // $product_id = $data["product_id"];

        // //统一下单
        // $result = $this->unifiedorder($openid, $product_id);
        // if(!array_key_exists("appid", $result) || !array_key_exists("mch_id", $result) || !array_key_exists("prepay_id", $result))
        // {
        //  	//统一下单失败
        //  	return false;
        // }

        // $this->SetData("appid", $result["appid"]);
        // $this->SetData("mch_id", $result["mch_id"]);
        // $this->SetData("nonce_str", WxPayApi::getNonceStr());
        // $this->SetData("prepay_id", $result["prepay_id"]);
        // $this->SetData("result_code", "SUCCESS");
        // $this->SetData("err_code_des", "OK");

        //支付成成功
        $this->setOrderStatus($data["out_trade_no"], 2);

        return true;
    }

    /**
     * 设置订单状态
     * @param string $id 订单ID
     * @param int $status 订单状态
     * @return boolean
     */
    protected function setOrderStatus($id, $status)
    {
        $params = ["order_id" => $id, "status" => $status];
        $result = dataRequest(API_ORDER_UPDATE, false, "post", $params);

        if ($result["state"] == "true") {
            return true;
        }

        return false;
    }

    /**
     * 查询订单状态
     * @param string $id 订单ID
     * @param string $uid 用户ID
     * @return int,1未支付,2支付成功且充值成功，3支付成功但是充值失败
     */
    protected function getOrderStatus($id, $uid)
    {
        $params = ["order_id" => $id, "account" => $uid];
        $result = dataRequest(API_ORDER_DETAIL, false, "post", $params);

        return $result["info"]["result"]["paystatus"] != 1;
    }
}
