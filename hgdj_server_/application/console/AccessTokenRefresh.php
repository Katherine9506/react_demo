<?php
/**
 * Created by PhpStorm.
 * User: 罗阁科技
 * Date: 2018/11/26
 * Time: 16:36
 */

namespace app\console;

use app\common\model\Redis as MyRedis;
use app\common\model\WxTemplateMessage;
use think\console\Command;
use think\console\Input;
use think\console\Output;
use WxPay\WxPayConfig;

class AccessTokenRefresh extends Command
{
    protected function configure()
    {
        $this->setName('refresh:access-token')->setDescription('Refresh Wechat Access Token.');
    }

    //执行方法
    protected function execute(Input $input, Output $output)
    {
        $ch = curl_init(WxTemplateMessage::ACCESS_TOKEN_URL . '?grant_type=client_credential&appid=' . WxPayConfig::APPID . '&secret=' . WxPayConfig::APPSECRET);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $result = curl_exec($ch);
        $result = json_decode($result);

        curl_close($ch);
//        var_dump($result);exit;
        $output->writeln($result->access_token);
        $output->writeln($result->expires_in);

        /* 设置access_token缓存及过期时间 */
        MyRedis::set('wechat_access_token', $result->access_token, $result->expires_in);
    }
}