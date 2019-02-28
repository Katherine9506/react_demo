<?php
/**
 * Created by PhpStorm.
 * User: 罗阁科技
 * Date: 2018/11/26
 * Time: 15:57
 */

namespace app\common\model;


use app\common\model\Order as OrderModel;
use app\common\model\Redis as MyRedis;
use WxPay\WxPayConfig;

class WxTemplateMessage
{
    const MESSAGE_SEND_URL_PUBLIC = 'https://api.weixin.qq.com/cgi-bin/message/template/send';//公众号 发送模板消息
    const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/token';//获取access_token
    // const ACCESS_UNIFORM_MESSAGE_URl = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send';
    const ACCESS_UNIFORM_MESSAGE_URl = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send';

    const WX_PUBLIC_CONFIG = [
        'APPID' => 'wx62b2b0b27c42c48d',
        'APPSECRET' => '0edf2dfd604cbe517f6a09a24f869cbc'
    ];

    //模板ID
    const INFOM_MEG = 'JBw4tWdMjyl0zSpBK3vIvm81K-8rhtaGmJiP3w8XFuI';//交易提醒

    //消息提示标题
    const MESSAGE_TITLES = [
        OrderModel::STATUS_UNTAKE => '您好，您有新订单。',
        OrderModel::STATUS_UNSTART => '您好，您收到老板的开始游戏提醒。',
    ];

    const MESSAGE_REMARKS = [
        OrderModel::STATUS_UNTAKE => '点击详情，前往小程序，完成接单。祝您游戏愉快！',
        OrderModel::STATUS_UNSTART => '点击详情，前往小程序，开始游戏。祝您游戏愉快！'
    ];

    //模板发送失败错误码
    const SEND_ERROR_CODE = [40037, 41028, 41029, 41030, 45009];

    /**
     * 发送模板消息--小程序
     * @param $type string 对应WxTemplateMessage类的模板消息ID
     */
    public static function sendTemplateMessage($templateId, $formId, $touser, $wxappData = array())
    {
        $access_token = self::getAccessToken();
        $data = array(
            'access_token' => $access_token,
            'touser' => $touser,
            'template_id' => $templateId,
            'page' => '/pages/index/index',
            'form_id' => $formId,
            'data' => $wxappData,
            // 'weapp_template_msg' => [
            //     'template_id' => $templateId,
            //     'page' => '/pages/index/index',
            //     'form_id' => $formId,
            //     'data' => $wxappData,
            //     "emphasis_keyword" => "keyword1.DATA"
            // ],
            // 'mp_template_msg' => [
            //     'appid' => 'wx62b2b0b27c42c48d',
            //     'template_id' => 'JBw4tWdMjyl0zSpBK3vIvm81K-8rhtaGmJiP3w8XFuI',
            //     'url' => 'http://weixin.qq.com/download',
            //     'miniprogram' => [
            //         'appid' => 'wx2daad8c3cd986d71',
            //         'pagepath' => '/pages/index/index'
            //     ],
            //     'data' => []
            // ],
        );
        $data = json_encode($data);
        $headers = array("Content-type: application/json");
//        Log::write();

        $ch = curl_init(self::ACCESS_UNIFORM_MESSAGE_URl . '?access_token=' . $access_token);

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        $result = json_decode($result);

        curl_close($ch);
        return $result;
    }

    /**
     * 发送模板消息--公众号
     * @param $data 模板数据
     * @param $templateId 模板消息ID
     * @param $openId 接收者openid
     */
    public static function sendPublicMessage($templateId, $openId, $data = array())
    {
        $access_token = self::getAccessToken();
        $postData = [
            'touser' => $openId,
            'template_id' => $templateId,
            'miniprogram' => [
                'appid' => WxPayConfig::APPID
            ],
            'data' => $data
        ];
        $postData = json_encode($postData);
        $headers = array("Content-type: application/json");

        $ch = curl_init(self::MESSAGE_SEND_URL_PUBLIC . '?access_token=' . $access_token);

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        $result = json_decode($result);

        curl_close($ch);
        return $result;
    }

    //获取小程序全局唯一后台接口调用凭据 1.redis 2.curl
    public static function getAccessToken()
    {
        if (MyRedis::has('wechat_access_token')) {
            $access_token = MyRedis::get('wechat_access_token');
        } else {
            $result = self::getAccessTokenViaCurl();
            $access_token = $result->access_token;
            /* 设置access_token缓存及过期时间 */
            MyRedis::set('wechat_access_token', $access_token, $result->expires_in);
        }
        return $access_token;
    }

    //通过curl访问，获取小程序后台接口调用凭据
    private static function getAccessTokenViaCurl()
    {
//        $ch = curl_init(self::ACCESS_TOKEN_URL . '?grant_type=client_credential&appid=' . self::WX_PUBLIC_CONFIG['APPID'] . '&secret=' . self::WX_PUBLIC_CONFIG['APPSECRET']);
        $ch = curl_init(self::ACCESS_TOKEN_URL . '?grant_type=client_credential&appid=' . WxPayConfig::APPID . '&secret=' . WxPayConfig::APPSECRET);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $result = curl_exec($ch);
        $result = json_decode($result);

        curl_close($ch);

        return $result;
    }
}