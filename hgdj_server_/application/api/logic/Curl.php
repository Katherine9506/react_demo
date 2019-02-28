<?php
/**
 * Created by PhpStorm.
 * User: 罗阁科技
 * Date: 2018/11/26
 * Time: 16:24
 */

namespace app\api\logic;


class Curl
{
    public static function httpGet($url = "")
    {
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 500);
        // 为保证第三方服务器与微信服务器之间数据传输的安全性，所有微信接口采用https方式调用，必须使用下面2行代码打开ssl安全校验。
        // 如果在部署过程中代码在此处验证失败，请到 http://curl.haxx.se/ca/cacert.pem 下载新的证书判别文件。
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_URL, $url);

        $res = curl_exec($curl);
        curl_close($curl);

        return $res;
    }

    public static function httpPost($url = "", $requestData = array())
    {
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        //普通数据
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($requestData));
        $res = curl_exec($curl);

        //$info = curl_getinfo($ch);
        curl_close($curl);
        return $res;
    }
}