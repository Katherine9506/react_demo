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

namespace app\api\controller;

use app\api\service\WXBizDataCrypt;
use app\common\model\Order as OrderModel;
use app\common\model\Skill;
use app\common\model\Unit;
use app\common\model\WxTemplateMessage;
use think\Cache;
use think\Config;
use think\Db;
use think\Request;
use app\common\model\FormIdCollection;

class Common extends Base
{
    protected $service_unit = [
        ['id' => 1, 'title' => '小时', 'name' => 'hour'],
        ['id' => 2, 'title' => '局', 'name' => 'game']
    ];

    /**
     * 小程序登录获取openid
     * @param code string
     */
    public function login()
    {
        if ($this->login_result) {
            return $this->show(1, '登录成功', $this->setSign($this->login_result));
        }
        return $this->show(0, '登录失败', "登录失败");
    }

    //判断是否登录
    public function isLogin()
    {
        if ($this->login_result['openid']) {
            return $this->show(1, '已登录', '已登录');
        }
        return $this->show(0, '未登录', '未登录');
    }

    //获取用户信息
    public function getUserinfo()
    {
        $openId = $this->request->get('openid');
        if (!isset($openId)) {
            return $this->show(0, '请求参数中缺少openid');
        }
        $user = Db::name('user')->field('id,openid,name,thumb,gender,birth,mobile,is_cert,balance,constell,province,city,area')->where(['openid' => $openId])->find();
        return $this->show(1, '', $this->setSign($user));
    }

    //个人信息设置
    public function setUserinfo()
    {
        $params = $this->request->post();
        $user = model('common/User')->find($params['id'])->save($params);
        if ($user) {
            return self::show(1, '已修改');
        } else {
            return self::show(0, '修改失败');
        }
    }

    //绑定用户手机号
    public function userMobile()
    {
        $skey = Request::instance()->header('X-WX-Skey');

        $post = $this->request->post();

        if (empty($post['encryptedData'])) {
            return $this->show(0, '绑定失败', $this->setSign("绑定绑定失败"));
        }
        $encrypt_data = $post['encryptedData'];
        $iv = $post['iv'];
        $session_key = Db::name('session')->where(['skey' => $skey])->value('session_key');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $appid = Config::get('wechat_config.appid');
        $pc = new WXBizDataCrypt($appid, $session_key);
        $errCode = $pc->decryptData($encrypt_data, $iv, $data);
        $data_arr = json_decode($data, true);
        //更新用户手机信息
        if ($data_arr['phoneNumber']) {
            Db::name('user')->where(['openid' => $openid])->update(['mobile' => $data_arr['phoneNumber']]);
        }

        return $this->show(1, '绑定成功', $this->setSign("绑定手机成功"));
    }

    public function logins()
    {
        $post = $this->param;
        $validate = new \think\Validate([
            'username|用户名' => 'require',
            'password|密码' => 'require',
            //'captcha|验证码'=>'require|captcha'
        ]);
        if (!$validate->check($post)) {
            return $this->show(0, $validate->getError());
        }
        $user = Db::name('user')->where(['phone' => $post['phone']])->find();

        if (!empty($user)) {
            if ($user['password'] !== md5(md5($post['password']) . $user['salt'])) {
                return $this->show(0, '手机号或密码错误');
            }
            if ($user['status'] == -1) {
                return $this->show(0, '你已被拉黑');
            }
            if ($user['status'] == 0) {
                return $this->show(0, '你的账户倍禁止登录，请联系管理员');
            }

            $login_salt = salt(30);
            if (false == Db::name('user')->where(['id' => $user['id']])->update(['login_num' => $user['login_num'] + 1, 'last_login_time' => time(), 'login_string' => $login_salt])) {
                return $this->show(0, '登录失败');
            }
        } else {
            return $this->show(0, '用户名不存在');
        }
        return $this->show(1, '登录成功', $this->setSign($login_salt));
    }

    public function registered()
    {
        $post = $this->param;
        $validate = new \think\Validate([
            'username|用户名' => 'require',
            'password|密码' => 'require|confirm',
            'name|昵称' => 'require',
        ]);
        if (!$validate->check($post)) {
            return $this->show(0, $validate->getError());
        }
        if (!empty(Db::name('user')->where(['username' => $post['username']])->find())) {
            return $this->show(0, '手机号已注册');
        }
        $post['status'] = 1;
        $post['salt'] = salt();
        $post['password'] = md5(md5($post['password']) . $post['salt']);

        Db::startTrans();
        try {
            \think\loader::model('common/user')->allowField(true)->save($post);
            // 提交事务
            Db::commit();
        } catch (\Exception $e) {
            // 回滚事务
            Db::rollback();
            return $this->show(0, $e->getMessage());
        }
        return $this->show(1, '注册成功');
    }

    public function logout()
    {
        if (!Cache::get($this->param['login_salt'])) {
            return $this->show(0, '非法请求');
        }
        Cache::rm($this->param['login_salt']);
        return $this->show(1, '退出成功');
    }

    //获取用户技能信息
    public function userSkill()
    {
        $openid = $this->request->param('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');
        $skill_list = Db::name('skill')->field('id,name,icon_id')->where(['status' => 1])->order('sort')->select();
        foreach ($skill_list as $key => $val) {
            $skill_list[$key]['icon'] = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $val['icon_id']])->value('path'));
            $skill_list[$key]['is_cert'] = Db::name('user_skills')->where(['sid' => $val['id'], 'uid' => $uid])->value('is_cert');
            $skill_list[$key]['status'] = Db::name('user_skills')->where(['sid' => $val['id'], 'uid' => $uid])->value('status');
        }

        // $user_skills  = Db::name('user_skills')->field('sid')->where(['uid' => $uid])->select();
        // $has_skill_ids = array_column($user_skills, 'sid');

        $has_skill = [];
        $hasno_skill = [];
        // if ($user_skills) 
        // {
        foreach ($skill_list as $k => $v) {
            if ($v['status'] == 1) {
                $has_skill[] = $v;
            } else {
                $hasno_skill[] = $v;
            }
            // if (in_array($v['id'], $has_skill_ids))
            // {
            //     if ($has_skill_ids) {
            //         # code...
            //     }
            //     $has_skill[] = $skill_list[$k];
            //     unset($skill_list[$k]);
            // }
        }
        // }
        $result['hasno_skill'] = $hasno_skill;
        $result['has_skill'] = $has_skill;
        return $this->show(1, 'ok', $this->setSign($result));
    }

    //获取用户技能详情信息
    public function userSkillInfo()
    {
        $data = $this->request->post();
        $sid = $data['sid'];
        $openid = $data['openid'];
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');
        $paragraph = Db::name('paragraph')->field('id,name')->where(['sid' => $sid])->order('sort')->select();
        $largearea = Db::name('largearea')->field('id,name')->where(['sid' => $sid])->order('sort')->select();
        $label = Db::name('label')->field('id,name')->where(['sid' => $sid, 'type' => 1])->order('sort')->select();
        $user_skill = Db::name('user_skills')->where(['uid' => $uid, 'sid' => $sid])->find();
        $user_skill['image'] = $user_skill['image_id'] ? str_replace("\\", "/", $this->domain . Db::name('resource')->find($user_skill['image_id'])['path']) : null;

        if (isset($user_skill['label_ids'])) {
            $has_label = explode(",", $user_skill['label_ids']);
            foreach ($label as $k => $v) {
                if (in_array($v['id'], $has_label)) {
                    $label[$k]['checked'] = true;
                } else {
                    $label[$k]['checked'] = false;
                }
            }
        }

        if (isset($user_skill['paragraph_id'])) {
            foreach ($paragraph as $k => $v) {
                if ($v['id'] == $user_skill['paragraph_id']) {
                    $result['idx'] = $k;
                }
            }
        }

        if (isset($user_skill['largearea_id'])) {
            foreach ($largearea as $k => $v) {
                if ($v['id'] == $user_skill['largearea_id']) {
                    $result['reg'] = $k;
                }
            }
        }

        $result['paragraph'] = $paragraph;
        if (empty($largearea)) {
            $result['largearea'] = false;
        } else {
            $result['largearea'] = $largearea;
        }

        $result['label'] = $label;
        $result['user_skill'] = $user_skill;
        $result['skill_name'] = Db::name('skill')->where(['id' => $sid])->value('name');

        return $this->show(1, 'ok', $this->setSign($result));
    }

    //用户技能审核提交
    public function userSkillSubmit()
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $data = $this->request->post();
        $data['label_ids'] = implode(",", $data['label_ids']);
        $data['create_time'] = time();
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $data['uid'] = Db::name('user')->where(['openid' => $openid])->value('id');
        $id = Db::name('user_skills')->where(['uid' => $data['uid'], 'sid' => $data['sid']])->value('id');
        if ($id) {
            $res = Db::name('user_skills')->where(['id' => $id])->update($data);
        } else {
            $res = Db::name('user_skills')->insert($data);
        }

        if ($res) {
            return $this->show(1, '提交成功');
        }

    }

    //提交用户审核前获取的信息
    public function userCheck()
    {
        $openid = $this->request->param('openid');
        $user_info = Db::name('user')->field('id,openid,gender,birth,cover_id,image_ids,audio_id,label_ids')->where(['openid' => $openid])->find();

        $label = Db::name('label')->field('id,name')->where(['type' => 2])->order('sort')->select();
        $has_label = explode(",", $user_info['label_ids']);
        foreach ($label as $k => $v) {
            if (in_array($v['id'], $has_label)) {
                $label[$k]['checked'] = true;
            } else {
                $label[$k]['checked'] = false;
            }
        }
        $user_info['label'] = $label;

        $cover = [];
        if ($user_info['cover_id']) {
            $cover = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $user_info['cover_id']])->value('path'));
        }
        $user_info['cover'] = $cover;

        if ($user_info['audio_id']) {
            $user_info['audio'] = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $user_info['audio_id']])->value('path'));
        }

        $image_ids = [];
        if ($user_info['image_ids']) {
            $map['id'] = ['in', $user_info['image_ids']];
            $image_ids = Db::name('resource')->field('id,path')->where($map)->select();

            foreach ($image_ids as $k => $v) {
                $image_ids[$k]['path'] = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $v['id']])->value('path'));
            }
        }
        $user_info['images'] = $image_ids;
        $user_info['audio'] = Db::name('resource')->field('id,path')->find($user_info['audio_id']);

        return $this->show(1, 'ok', $this->setSign($user_info));
    }

    //用户审核提交
    public function userCheckSubmit()
    {
        $data = $this->request->post();

        if (isset($data['labels'])) {
            $data['label_ids'] = implode(",", $data['labels']);
        }
        $data['image_ids'] = implode(",", $data['images']);
        unset($data['labels'], $data['images']);

        $data['is_cert'] = 1;//提交审核后状态改为待审核
        Db::name('user')->where(['openid' => $data['openid']])->update($data);

        return $this->show(1, '提交成功');
    }

    //用户接单设置价格显示
    public function userSkillUnit()
    {
        // $skey   = Request::instance()->header('X-WX-Skey');
        $openid = $this->request->post('openid');

        // $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');
        $user_skills = Db::name('user_skills')->field('sid,order_status')->where(['uid' => $uid])->select();
        foreach ($user_skills as $k => $v) {
            $skill = Db::name('skill')->field('id,name,unit,icon_id')->where(['id' => $v['sid']])->find();
            $skill['icon'] = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $skill['icon_id']])->value('path'));
            $skill['order_status'] = $v['order_status'];
            $skill_unit_arr = explode(",", $skill['unit']);
            $skill_unit = [];
            $unit_map['id'] = ['in', $skill['unit']];
            $service_unit = Db::name('unit')->where($unit_map)->select();
            foreach ($service_unit as $key => $val) {
                $map['unit_id'] = $val['id'];
                $map['uid'] = $uid;
                $map['sid'] = $v['sid'];
                $price = Db::name('skill_price')->where($map)->value('price');
                $val['price'] = $price ? $price : '未设置';
                $skill_unit[] = $val;
            }
            $skill['unit_name'] = $skill_unit;
            $user_skills[$k] = $skill;
        }

        return $this->show(1, 'ok', $this->setSign($user_skills));
        // var_dump($user_skills);
    }

    //设置单元价格
    public function skillUnitPrice()
    {
        $data = $this->request->post();
        $skill = Db::name('skill')->field('name,limit_price')->where(['id' => $data['sid']])->find();
        if ($data['price'] < $skill['limit_price']) {
            return $this->show(0, $skill['name'] . '价格设置不能小于' . $skill['limit_price'] . '元');
        }
        $data['uid'] = Db::name('user')->where(['openid' => $data['openid']])->value('id');
        unset($data['openid']);
        $map['uid'] = $data['uid'];
        $map['sid'] = $data['sid'];
        $map['unit_id'] = $data['unit_id'];
        $pid = Db::name('skill_price')->where($map)->value('id');
        if ($pid) {
            $res = Db::name('skill_price')->where(['id' => $pid])->update($data);
        } else {
            $data['status'] = 0;
            $data['create_time'] = time();
            $res = Db::name('skill_price')->insert($data);
        }
        if ($res) {
            return $this->show(1, '设置成功！');
        } else {
            return $this->show(0, '设置失败，请重新设置！');
        }
    }

    //发送模板消息
    public function sendTemplateMessage($templateId, $orderId)
    {
        $order = OrderModel::get($orderId);
        $unit = Unit::get($order->unit_id)->value('title');
        $skill = Skill::get($order->sid)->value('name') . ' ' . $order->count . '*' . $unit;
        $playname = \app\common\model\User::get($order->play_uid)->value('name'); 

        $openId = Db::name('user')->where(['id' => $order['boss_uid']])->value('openid');

        $data = [
            // 'first' => [
            //     'value' => WxTemplateMessage::MESSAGE_TITLES[$order->status],
            //     'color' => '#173177'
            // ],
            'keyword1' => [
                'value' => $order['order_no'],
                'color' => '#173177'
            ],
            'keyword2' => [
                'value' => $skill,
                'color' => '#173177'
            ],
            'keyword3' => [
                'value' => $playname,
                'color' => '#173177'
            ],
            'keyword4' => [
                'value' => date('Y-m-d H:i:s', time()),
                'color' => '#173177'
            ],
            'keyword5' => [
                'value' => "大神已接单，请进入我的订单查看",
                'color' => '#173177'
            ]
            // 'remark' => [
            //     'value' => WxTemplateMessage::MESSAGE_REMARKS[$order->status],
            //     'color' => '#173177'
            // ]
        ];
        $collection = new FormIdCollection($openId);
        $formId = $collection->get(true);
        $sendRes = WxTemplateMessage::sendTemplateMessage($templateId, $formId, $openId, $data);

        // if ($sendRes->errcode == 0) {
        //     self::show(1, '模板发送成功', [$sendRes]);
        // } else {
        //     self::show(0, '模板发送失败', [$sendRes]);
        // }
    }

    //收集用户的formid
    public function collectFormId()
    {
        $formId = $this->param['formId'];
        $openId = $this->param['openid'];

        $collection = new FormIdCollection($openId);
        $collection->save($formId);
    }

    //获取协议内容
    public function protocolDetail()
    {
        if(!isset($this->param['id']) or $this->param['id'] < 1) 
        {
            return $this->show(0,'参数不正确');
        }
        $protocol = \think\Db::name('content')
                ->where(['id'=>$this->param['id'],'status'=>['>',0]])
                ->find();

        $model = new \app\common\model\Content();
        $model->where(['id' => $this->param['id']])->setInc('num');

        return $this->show(1,'',$this->setSign($protocol));
    }
}
