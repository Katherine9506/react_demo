<?php
// +----------------------------------------------------------------------
// | Tplay [ WE ONLY DO WHAT IS NECESSARY ]
// +----------------------------------------------------------------------
// | Copyright (c) 2018 http://tplay.pengyichen.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: yuanyuan < 38625673@qq.com >
// +----------------------------------------------------------------------

namespace app\admin\controller;

use app\common\model\Order as OrderModel;
use app\common\model\Unit;
use app\common\model\User as UserModel;
use app\common\model\Withdraw;
use app\common\model\Withdraw as WithdrawModel;
use app\tplay\lib\Authcheck;
use think\Db;
use think\Loader;

class Order extends Authcheck
{
    protected $service_unit = [
        ['id' => 1, 'title' => '小时'],
        ['id' => 2, 'title' => '局']
    ];

    //订单列表
    public function list()
    {
        $map = [];
        $data = $this->request->param();
        if (isset($data['key'])) {
            if ($data['key']['status'] >= 0) {
                $map['status'] = $data['key']['status'];
            }
        }

        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $list = \think\loader::model('common/order')
            ->where($map)
            ->order('create_time desc')
            ->paginate($limit, false, ['query' => $this->request->param()])
            ->each(function ($item, $key) {
                // $item->icon = '<img width="50px" src="'.Db::name('resource')->where(['id' => $item->icon_id])->value('path').'"/>';
                $item->boss = Db::name('user')->where(['id' => $item->boss_uid])->value('name');
                $item->player = Db::name('user')->where(['id' => $item->play_uid])->value('name');
                $item->transaction_id = $item->transaction_id ? $item->transaction_id : '--';
                $item->skill = Db::name('skill')->where(['id' => $item->sid])->value('name');
                $item->status_str = OrderModel::TYPE_STAUTS[$item->status];
                $item->unit = Db::name('unit')->where(['id' => $item->unit_id])->value('title');
            });

        return $this->showList($list);
    }

    //订单提现列表
    public function withdraw()
    {
        $limit = $this->request->get('limit') ?: 10;
        $page = $this->request->get('page') ?: 10;
        $status = $this->request->get('status', -1);
        $withdrawList = Loader::model('common/Withdraw')->ofFinalStatus($status)->order('id desc')->paginate($limit, false, ['page' => $page])->each(function ($item) {
            $item->uname = UserModel::get($item->uid)->name;
            $item->orders = OrderModel::all($item->oids);
            foreach ($item->orders as $order) {
                $skillName = \app\common\model\Skill::get($order->sid)->value('name');
                $unitName = Unit::get($order->unit_id)->value('title');
                $order->status = OrderModel::TYPE_STAUTS[$order->status];
                $order->skill_name = $skillName;
                $order->unit_name = $unitName;
            }
            $status2 = [];
            foreach ($item->status as $status) {
                $status2[] = [
                    'id' => $status['id'],
                    'desc' => $status['desc'],
                    'timestamp' => date('Y-m-d H:i', $status['timestamp'])
                ];
            }
            $item->status = array_reverse($status2);
        });

        return $this->showList($withdrawList);
    }

    //确认提现
    public function withdrawHandler($id, $option, $reason = null)
    {
        $withdraw = WithdrawModel::get($id);
        $status = $withdraw->status;
        $status[] = [
            'id' => (int)$option,
            'desc' => $reason ?: WithdrawModel::WITHDRAW_STATUS[$option],
            'timestamp' => time()
        ];
        $withdraw->save(['status' => $status, 'final' => (int)$option]);
        if (true) {
            return self::show();
        } else {
            return self::show(0);
        }
    }

    //添加陪玩项目
    public function add()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $post['unit'] = implode(",", $post['unit']);

            $validate = new \think\Validate([
                'name' => 'require',
                'icon_id' => 'require',
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }
            $post['create_time'] = time();

            // 启动事务
            Db::startTrans();
            try {
                \think\loader::model('common/skill')->allowField(true)->save($post);
                // 提交事务
                Db::commit();
            } catch (\Exception $e) {
                // 回滚事务
                Db::rollback();
                return $this->error('操作失败');
            }
            return $this->success('操作成功');
        } else {
            $result['data'] = 'ok';
            return $this->show(1, 'ok', $result);
        }
    }

    //上传图片文件
    public function uploadIcon()
    {
        $result = self::upload('admin', 'skillicon');
        //添加视频文件
        $insert['type'] = 1;
        $insert['name'] = $result['name'];
        $insert['path'] = str_replace("\\", "/", $result['data']);
        $insert['create_time'] = time();

        Db::name('resource')->insert($insert);
        $iid = Db::name('resource')->getLastInsID();

        $result['iid'] = $iid;
        $result['path'] = $insert['path'];

        return $this->show(1, 'ok', $result);
    }

    public function edit()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();

            $validate = new \think\Validate([
                'name' => 'require',
                'icon_id' => 'require'
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }

            $post['unit'] = implode(",", $post['unit']);

            // 启动事务
            Db::startTrans();
            try {
                \think\loader::model('common/skill')->allowField(true)->save($post, ['id' => $post['id']]);
                // 提交事务
                Db::commit();
            } catch (\Exception $e) {
                // 回滚事务
                Db::rollback();
                return $this->error('操作失败');
            }
            return $this->success('操作成功');

        } else {
            $id = $this->request->param('id');
            if (empty($id)) {
                return $this->error('参数不正确');
            }
            $info['skill'] = \think\loader::model('common/skill')->where(['id' => $id])->find();
            if (empty($info['skill'])) {
                return $this->error('非法操作');
            }

            $info['skill']['icon'] = Db::name('resource')->where(['id' => $info['skill']['icon_id']])->value('path');

            $unit = explode(",", $info['skill']['unit']);
            $service_unit = $this->service_unit;

            foreach ($service_unit as $k => $v) {
                if (in_array($v['id'], $unit)) {
                    $service_unit[$k]['checked'] = 1;
                } else {
                    $service_unit[$k]['checked'] = 0;
                }
            }
            $info['unit'] = $service_unit;

            $this->success('', '', $info);
        }
    }

    public function editPwd()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $validate = new \think\Validate([
                'old_pwd' => 'require|different:password',
                'password' => 'require|confirm'
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }
            $admin = Db::name('admin')->where(['id' => $this->admin_id])->find();
            if (md5(md5($post['old_pwd']) . $admin['salt']) !== $admin['password']) {
                return $this->error('旧密码错误');
            }
            $salt = salt();
            if (false == Db::name('admin')->where(['id' => $this->admin_id])->update(['password' => md5(md5($post['password']) . $salt), 'salt' => $salt])) {
                return $this->error('操作失败');
            } else {
                return $this->success('操作成功');
            }
        }
    }

    public function del()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $array = [];
            if (!is_array($post['id'])) {
                $array[] = $post['id'];
            } else {
                $array = $post['id'];
            }
            foreach ($array as $v) {
                if ($v == $this->admin_id) {
                    return $this->error('不能删除自己');
                }
            }
            if (false == $this->soft(['model' => 'common/admin', 'index' => $array])) {
                return $this->error('操作失败');
            }
            return $this->success('操作成功');
        }
    }

    //段位信息列表
    public function paragraphList()
    {
        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $list = \think\loader::model('common/paragraph')
            ->where([])
            ->order('create_time desc')
            ->paginate($limit, false, ['query' => $this->request->param()])
            ->each(function ($item, $key) {
                $item->skill = Db::name('skill')->where(['id' => $item->sid])->value('name');
            });

        return $this->showList($list);
    }

    //添加段位信息
    public function addParagraph()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $validate = new \think\Validate([
                'name' => 'require',
                'sid' => 'require',
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }
            $post['create_time'] = time();

            // 启动事务
            Db::startTrans();
            try {
                \think\loader::model('common/paragraph')->allowField(true)->save($post);
                // 提交事务
                Db::commit();
            } catch (\Exception $e) {
                // 回滚事务
                Db::rollback();
                return $this->error('操作失败');
            }
            return $this->success('操作成功');
        } else {
            //获取技能列表
            $result['skill'] = \think\loader::model('common/skill')->field('id,name')->where(['status' => 1])->order('sort')->select();
            return $this->show(1, 'ok', $result);
        }
    }

    //大区信息列表
    public function largeareaList()
    {
        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $list = \think\loader::model('common/largearea')
            ->where([])
            ->order('create_time desc')
            ->paginate($limit, false, ['query' => $this->request->param()])
            ->each(function ($item, $key) {
                $item->skill = Db::name('skill')->where(['id' => $item->sid])->value('name');
            });

        return $this->showList($list);
    }

    //添加大区信息
    public function addLargearea()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $validate = new \think\Validate([
                'name' => 'require',
                'sid' => 'require',
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }
            $post['create_time'] = time();

            // 启动事务
            Db::startTrans();
            try {
                \think\loader::model('common/largearea')->allowField(true)->save($post);
                // 提交事务
                Db::commit();
            } catch (\Exception $e) {
                // 回滚事务
                Db::rollback();
                return $this->error('操作失败');
            }
            return $this->success('操作成功');
        } else {
            //获取技能列表
            $result['skill'] = \think\loader::model('common/skill')->field('id,name')->where(['status' => 1])->order('sort')->select();
            return $this->show(1, 'ok', $result);
        }
    }

    //标签信息列表
    public function labelList()
    {
        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $list = \think\loader::model('common/label')
            ->where(['type' => 1])
            ->order('create_time desc')
            ->paginate($limit, false, ['query' => $this->request->param()])
            ->each(function ($item, $key) {
                $item->skill = Db::name('skill')->where(['id' => $item->sid])->value('name');
            });

        return $this->showList($list);
    }

    //添加标签信息
    public function addLabel()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $validate = new \think\Validate([
                'name' => 'require',
                'sid' => 'require',
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }
            $post['type'] = 1;
            $post['create_time'] = time();

            // 启动事务
            Db::startTrans();
            try {
                \think\loader::model('common/label')->allowField(true)->save($post);
                // 提交事务
                Db::commit();
            } catch (\Exception $e) {
                // 回滚事务
                Db::rollback();
                return $this->error('操作失败');
            }
            return $this->success('操作成功');
        } else {
            //获取技能列表
            $result['skill'] = \think\loader::model('common/skill')->field('id,name')->where(['status' => 1])->order('sort')->select();
            return $this->show(1, 'ok', $result);
        }
    }

}
