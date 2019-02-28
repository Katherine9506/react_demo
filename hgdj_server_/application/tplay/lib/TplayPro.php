<?php
// +----------------------------------------------------------------------
// | Tplay [ WE ONLY DO WHAT IS NECESSARY ]
// +----------------------------------------------------------------------
// | Copyright (c) 2018 http://tplay.pengyichen.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 听雨 < 389625819@qq.com >
// +----------------------------------------------------------------------

namespace app\tplay\lib;

use OSS\Core\OssException;
use OSS\OssClient;
use think\Cache;
use think\Controller;
use think\Db;
use think\exception\HttpResponseException;
use think\Request;
use think\Response;

class TplayPro extends Controller
{
    public $domain = '';//域名

    protected function _initialize()
    {
        $storage_config = Db::name('system')->where(['key' => 'file_storage'])->value('value');
        $storage_config = json_decode($storage_config, true);
        if ($storage_config['storage_type'] == 'oss') {
            $this->domain = $storage_config['storage_oss_domain'];
        } else {
            $this->domain = $this->request->domain();
        }
    }

    /**
     * 软删除及恢复方法，支持批量软删除和批量恢复
     * @param [type] $data [description]
     */
    public static function soft($data = [])
    {
        $data['key'] = empty($data['key']) ? 'id' : $data['key'];
        $data['status'] = empty($data['status']) ? 'status' : $data['status'];
        $data['val'] = empty($data['val']) ? -1 : $data['val'];
        $list = [];
        foreach ($data['index'] as $k => $v) {
            $list[$k][$data['key']] = $v;
            $list[$k][$data['status']] = $data['val'];
        }
        if (false == \think\loader::model($data['model'])->isUpdate()->saveAll($list)) {
            return false;
        }
        return true;
    }

    /**
     * 硬删除哈
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public static function delete($data = [])
    {
        foreach ($data['key'] as $k => $v) {
            $data['key'][$k] = (int)$v;
        }
        if (false == \think\loader::model($data['model'])->destroy($data['key'])) {
            return false;
        }
        return true;
    }

    public static function setSign($data = [])
    {
        // 1 按字段排序
        //ksort($data);
        // 2拼接字符串数据
        $string = json_encode($data);
        // 3通过aes来加密
        // $string = (new Aes())->encrypt($string);
        return $string;
    }

    public static function checkSign($data)
    {
//        解密字符串
        $str = (new Aes())->decrypt($data['sign']);
        if (empty($str)) {
            self::setMsg("解密出来的字符串为空");
            return false;
        }
//      分解为数组
        $arr = json_decode($str, true);
        if (!is_array($arr)) {
            self::setMsg("解密出来的数据不是数组");
            return false;
        }
//        验证是否存在时间戳
        if ((!is_array($arr) || empty($arr['timestamp']) || $arr['timestamp'] != $data['timestamp'])) {
            self::setMsg("未设置时间戳或验证串内的时间戳不等于发送过来的时间戳");
            return false;
        }
        $time = time();
        if ((($time - ceil($arr['timestamp'] / 1000)) > config('app.app_sign_time'))) {
            $conf = config('app.app_sign_time');
            $time = $time - ceil($arr['timestamp'] / 1000);
            self::setMsg("时间戳超时,当前时间-时间戳={$time},大于{$conf}");
            return false;
        }
//        唯一性判定,如果已存在对应的sign报错
        if (Cache::get($data['sign'])) {
            $time = config('app.app_sign_cache_time');
            self::setMsg("SIGN在{$time}秒内不能重复使用");
            return false;
        }
        return $str;
    }

    /**
     * 返回数据,一般用于不带分页的单条数据
     * @param $code 状态
     * @param $msg 提示信息
     * @param $data 要返回的数据
     * @param $url 帮助信息的url
     * @param $header 附加header
     * @param $option 相关选项
     * @return int
     */
    public static function show($code = 1, $msg = "OK", $data = [], $url = '', $httpCode = 200, $header = [], $options = [])
    {
        $res = ['code' => $code];
        $res['msg'] = $msg;
        $res['url'] = $url;
        if (is_object($data)) {
            $data = $data->toArray();
        }
        $res['data'] = $data;
        $response = Response::create($res, "json", $httpCode, $header, $options);
        throw new HttpResponseException($response);
    }

    /**
     * 返回数据，一般用于带分页的多条数据对象
     * @param  [type]  $data     [description]
     * @param  integer $code [description]
     * @param  string $msg [description]
     * @param  integer $httpCode [description]
     * @param  [type]  $header   [description]
     * @param  [type]  $options  [description]
     * @return [type]            [description]
     */
    public static function showList($data, $code = 0, $msg = '', $httpCode = 200, $header = [], $options = [])
    {
        $res['code'] = $code;
        $res['msg'] = $msg;
        if (is_object($data)) {
            $data = $data->toArray();
        }
        if (!empty($data['total'])) {
            $res['count'] = $data['total'];
        } else {
            $res['count'] = 0;
        }
        $res['data'] = $data['data'];
        $response = Response::create($res, "json", $httpCode, $header, $options);
        throw new HttpResponseException($response);
    }

    /**
     * 记录访问日志
     * @return [type] [description]
     */
    public static function userLog()
    {
        $request = Request::instance();
        $ip = $request->ip();
        $time = strtotime(date('Y-m-d'));
        $log = Db::name('user_log')->where(['ip' => $ip, 'create_time' => [['>=', $time], ['<=', $time + 24 * 3600]]])->find();
        if (empty($log)) {
            \think\loader::model('common/userLog')->save(['ip' => $ip, 'num' => 1]);
        } else {
            \think\loader::model('common/userLog')->save(['num' => $log['num'] + 1], ['id' => $log['id']]);
        }
    }

    public static function upload($module, $use)
    {
        if (request()->file('file')) {
            $file = request()->file('file');
        } else {
            $res['code'] = 0;
            $res['msg'] = '没有上传文件';
            return $res;
        }
        $file_info = $file->getInfo();

        // $info = $file->rule('sha1')->move(ROOT_PATH . 'public' . DS . 'upload' . DS . $module . DS . $use);
        $info = $file->move(ROOT_PATH . 'public' . DS . 'upload' . DS . $module . DS . $use);

        $pattern = '/upload([\w\W]+?)*/';
        preg_match($pattern, $info->getPathname(), $matches);
        $path = str_replace("\\", "/", $matches[0]);

        if ($info) {
            $res['code'] = 1;
            $res['name'] = $file_info['name'];
            $res['data'] = DS . 'upload' . DS . $module . DS . $use . DS . $info->getSaveName();

            self::uploadOss($info->getPathname(), $path);

            return $res;
        } else {
            // 上传失败获取错误信息
            return self::error('上传失败：' . $file->getError());
        }
    }

    /**
     * 图片上传到阿里云OSS
     * string pathname 本地文件路径
     * string path 文件上传路径
     */
    public static function uploadOss($pathname, $path)
    {
        $oss_config = Db::name('system')->where(['key' => 'file_storage'])->value('value');
        $oss_config = json_decode($oss_config, true);
        // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录 https://ram.console.aliyun.com 创建RAM账号。
        $accessKeyId = $oss_config['storage_oss_keyid'];
        $accessKeySecret = $oss_config['storage_oss_secret'];
        // Endpoint以杭州为例，其它Region请按实际情况填写。
        $endpoint = $oss_config['storage_oss_endpoint'];
        // 存储空间名称
        $bucket = $oss_config['storage_oss_bucket'];

        // 文件名称
        $object = ltrim($path, '/');
        try {
            $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);

            $ossClient->uploadFile($bucket, $object, $pathname);
        } catch (OssException $e) {
            printf(__FUNCTION__ . ": FAILED\n");
            printf($e->getMessage() . "\n");
            return;
        }
        return;
    }
}
