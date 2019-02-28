<?php

namespace app\api\service;

use app\service\model\Redis as MyRedis;

class CaptchaService
{
    /* 验证码缓存失效时间 */
    private $codeExpriedTime = 600;//十分钟

    private $phone;

    const ERROR_MSG_PHONE = '未设置手机号';

    public function __construct($phone = null)
    {
        $this->phone = $phone;
    }

    /* 发送验证码 */
    public function send()
    {
        $code = $this->generateCode();

        if (!$this->check()) {
            return ['status' => false, 'msg' => '手机号或用户缓存标志未设置'];
        }
        //TODO 发送验证码至用户 $this->user->phone

        /* 将验证码存入缓存 设置缓存时间 */
        MyRedis::set('lanbaba:user:' . $this->phone, $code, $this->codeExpriedTime);
        return ['status' => true, 'code' => $code];
    }

    /* 检查必要条件 */
    public function check()
    {
        return isset($this->phone);
    }

    /* 产生验证码 */
    private function generateCode($len = 6)
    {
        $chars = str_repeat('0123456789', 3);
        $chars = str_repeat($chars, $len);
        $chars = str_shuffle($chars);
        $str = substr($chars, 0, $len);
        return $str;
    }

    /* 检查验证码有效期 */
    public static function checkCaptchaValidation($phone)
    {
        return MyRedis::get('lanbaba:user:' . $phone);
    }

    /* 删除验证码 */
    public static function deleteUsedCaptcha($phone)
    {
        return MyRedis::rm('lanbaba:user:' . $phone);
    }

    /**
     * @param null $phone
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
    }

}