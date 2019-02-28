<?php

namespace app\api\controller;

use app\api\service\WxAppService;
use app\api\service\WXBizDataCrypt;
use app\common\model\User as UserModel;
use think\Config;
use think\Controller;
use think\Db;
use think\Request;

class BaseController extends Controller
{
    public $loginStatus;

    protected function _initialize()
    {
        parent::_initialize();
        $this->loginStatus = $this->getOpenId();
    }

    private function getOpenId()
    {
        $result = [];
        $skey = Request::instance()->header('X-WX-Skey');
        if ($skey) {
            $result['openid'] = Db::name('session')->where('skey', $skey)->value('openid');
        } else {
            $code = request()->header('X-WX-Code');
            $encrypted_data = request()->header('X-WX-Encrypted-Data');
            $iv = request()->header('X-WX-IV');

            $service = (new WxAppService())->login($code);
            if (!isset($service->openid) || !isset($service->session_key)) {
                //TODO
            }
            $appid = Config::get('wechat.appid');
            $pc = new WXBizDataCrypt($appid, $service->session_key);
            $errCode = $pc->decryptData($encrypted_data, $iv, $data);

            if ($errCode == 0) {
                $data = json_decode($data, true);

                $params['openid'] = $data['openId'];
                $params['name'] = $data['nickName'];
                $params['avatar'] = $data['avatarUrl'];

                /* 更新或创建用户 */
                if ($user = UserModel::where('openid', $data['openId'])->find()) {
                    $user->update($params, ['id' => $user['id']]);
                } else {
                    $params['id'] = create_uuid();
                    $user = UserModel::create($params);
                }
            } else {
                //TODO
            }
            $user = UserModel::get($user->id);

            $data['id'] = $user->id;
            $data['phone'] = $user->phone;
            $data['is_member'] = $user->is_member;
            $data['sign_member'] = $user->sign_member;
            $data['expire_date'] = $user->expire_date;

            $result['skey'] = sha1($service->openid . $service->session_key);
            $result['userInfo'] = $data;
            $result['openid'] = $service->openid;

            Db::name('session')->insert([
                'skey' => $result['skey'],
                'session_key' => $service->session_key,
                'openid' => $service->openid
            ]);
        }
        return $result;
    }


    public function successJson($data, $msg = '')
    {
        return $this->json($data, 200, $msg);
    }

    public function errorJson($data, $msg = '')
    {
        return $this->json($data, 400, $msg);
    }

    public function noContent($msg = '')
    {
        return $this->json([], 204, $msg);
    }

    public function json($data, $code, $msg, array $header = [])
    {
        return $this->result($data, $code, $msg, 'json', $header);
    }
}