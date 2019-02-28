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

namespace app\admin\controller;

use app\common\model\FormIdCollection;
use app\common\model\WxTemplateMessage;
use app\tplay\lib\Authcheck;
use think\Db;
use think\Loader;

class User extends Authcheck
{
    public function index()
    {
        $map = [];
        $data = $this->request->param();
        if (isset($data['key'])) {
            if ($data['key']['is_cert'] >= 0) {
                $map['is_cert'] = $data['key']['is_cert'];
            }
        }

        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $data = \think\loader::model('common/user')
            ->where($map)
            ->order('create_time desc')
            ->paginate($limit, false, ['query' => $this->request->param()])
            ->each(function ($item, $key) {
                $item->address = $item->province . '-' . $item->city;
                $item->cert = $item->is_cert == 0 ? '未认证' : ($item->is_cert == 1 ? '待审核' : '已认证');
                $item->avatar = "<img src='" . $item->thumb . "'/>";
                $item->mobile = $item->mobile ? $item->mobile : '-';
                $item->gender = $item->gender == 1 ? '<i class="layui-icon layui-icon-male" style="font-size: 25px; color: #1E9FFF;"></i>' : '<i class="layui-icon layui-icon-female" style="font-size: 25px; color: #ef13a9;"></i>';
            });

        return $this->showList($data);
    }

    //用户标签管理
    public function label()
    {
        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $data = \think\loader::model('common/label')->where(['type' => 2])->order('create_time desc')->paginate($limit, false, ['query' => $this->request->param()]);

        return $this->showList($data);
    }

    //添加标签
    public function addLabel()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $validate = new \think\Validate([
                'name' => 'require',
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }
            $post['type'] = 2;
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
            $result = 'ok';
            return $this->show(1, 'ok', $result);
        }
    }

    public function shielding()
    {
        $param = $this->request->param();
        $array = [];
        if (!is_array($param['id'])) {
            $array[] = $param['id'];
        } else {
            $array = $param['id'];
        }
        if (false == $this->soft(['model' => 'common/user', 'index' => $array])) {
            return $this->error('操作失败');
        }
        return $this->success('操作成功');
    }

    public function reverse()
    {
        $param = $this->request->param();
        $array = [];
        if (!is_array($param['id'])) {
            $array[] = $param['id'];
        } else {
            $array = $param['id'];
        }
        if (false == $this->soft(['model' => 'common/user', 'index' => $array, 'val' => 1])) {
            return $this->error('操作失败');
        }
        return $this->success('操作成功');
    }

    public function message()
    {
        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $data = \think\loader::model('common/message')->order('create_time desc')->paginate($limit, false, ['query' => $this->request->param()])->each(function ($item, $key) {
            $item->contentName = Db::name('content')->where(['id' => $item->content_id])->value('title');
        });

        return $this->showList($data);
    }

    public function shieldingMsg()
    {
        $param = $this->request->param();
        $array = [];
        if (!is_array($param['id'])) {
            $array[] = $param['id'];
        } else {
            $array = $param['id'];
        }
        if (false == $this->soft(['model' => 'common/message', 'index' => $array])) {
            return $this->error('操作失败');
        }
        return $this->success('操作成功');
    }

    public function delMsg()
    {
        $param = $this->request->param();
        $array = [];
        if (!is_array($param['id'])) {
            $array[] = $param['id'];
        } else {
            $array = $param['id'];
        }
        if (false == $this->delete(['model' => 'common/message', 'key' => $array])) {
            return $this->error('操作失败');
        }
        return $this->success('操作成功');
    }

    public function contact()
    {
        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $data = \think\loader::model('common/contact')->order('create_time desc')->paginate($limit, false, ['query' => $this->request->param()]);

        return $this->showList($data);
    }

    public function delContact()
    {
        $param = $this->request->param();
        $array = [];
        if (!is_array($param['id'])) {
            $array[] = $param['id'];
        } else {
            $array = $param['id'];
        }
        if (false == $this->delete(['model' => 'common/contact', 'key' => $array])) {
            return $this->error('操作失败');
        }
        return $this->success('操作成功');
    }

    //技能认证列表
    public function skillCert()
    {
        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $status = $this->request->get('status', -1);
        $list = \think\loader::model('common/user_skills')
            ->ofStatus($status)
            ->where([])
            ->order('create_time desc')
            ->paginate($limit, false, ['query' => $this->request->param()])
            ->each(function ($item, $key) {
                $item->name = Db::name('user')->where(['id' => $item->uid])->value('name');
                $item->skill_name = Db::name('skill')->where(['id' => $item->sid])->value('name');
                $item->paragraph = Db::name('paragraph')->where(['id' => $item->paragraph_id])->value('name');
                $item->largearea = Db::name('largearea')->where(['id' => $item->largearea_id])->value('name');
                $item->labels = $this->getSkillLabels($item->label_ids);
                $item->cert = $item->is_cert == 1 ? '已认证' : '待认证';
                $item->status_desc = $item->status == 1 ? '已审核' : '待审核';
                $item->image = $item->image_id ? $this->domain . Db::name('resource')->find($item->image_id)['path'] : '';
            });
        return $this->showList($list);
    }

    //切换用户技能审核状态
    public function skillCertChange($id, $status)
    {
        $res = Loader::model('common/UserSkills')->save(['status' => $status], ['id' => $id]);
        if ($res) {
            return self::show();
        } else {
            return self::show(0);
        }
    }

    //获取技能标签
    private function getSkillLabels($label_ids = '')
    {
        if (!$label_ids) {
            return;
        }
        // $label_arr = explode(",", $label_ids);
        $map['type'] = 1;
        $map['id'] = ['in', $label_ids];
        $labels = Db::name('label')->field('name')->where($map)->select();
        return array_column($labels, "name");
    }

    //认证用户信息显示
    public function checkCert()
    {
        if ($this->request->isPost()) {
            $post = $this->request->post();
            $validate = new \think\Validate([
                'id' => 'require',
                // 'name' => 'require',
                'is_cert' => 'require'
            ]);

            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }

            // $post['unit'] = implode(",", $post['unit']);
            $content = $post['reason'];
            $openId = $post['openid'];

            // 启动事务
            Db::startTrans();
            try {
                \think\loader::model('common/user')->allowField(true)->save($post, ['id' => $post['id']]);
                //发送推送消息
                if ($post['is_cert'] == 3) {
                    //驳回
                    $templateId = "tRd-SJTbflKQaJ23yOdXdEDrqlxq5loHoCgl4bsYd1g";
                    $this->sendTemplateMessage($templateId, $openId, $content);
                }
                if ($post['is_cert'] == 2) {
                    //审核通过
                    $templateId = "JZ4t92dE2fNQ6gdN-gy2X31LIsa6i0nZR3dCIZLm1iM";
                    $this->sendTemplateMessage($templateId, $openId, $content);
                }
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
            $info['user'] = \think\loader::model('common/user')->field('id,name,openid,mobile,birth,cover_id,image_ids,audio_id,label_ids')->where(['id' => $id])->find();
            if (empty($info['user'])) {
                return $this->error('非法操作');
            }

            $info['user']['cover'] = $info['user']['cover_id'] ? $this->domain . Db::name('resource')->where(['id' => $info['user']['cover_id']])->value('path') : '';
            $info['user']['audio'] = $info['user']['audio_id'] ? $this->domain . Db::name('resource')->where(['id' => $info['user']['audio_id']])->value('path') : '';
            $info['user']['images'] = [];
            $images_arr = [];
            if ($info['user']['image_ids']) {
                $image_map['id'] = ['in', $info['user']['image_ids']];
                $images = Db::name('resource')->field('path')->where($image_map)->select();
                foreach ($images as $k => $v) {
                    $images_arr[] = $this->domain . $v['path'];
                }
            }
            $info['user']['images'] = $images_arr;
            $labels_arr = [];
            if ($info['user']['label_ids']) {
                $label_map['id'] = ['in', $info['user']['label_ids']];
                $label_map['type'] = 2;
                $labels = Db::name('label')->field('name')->where($label_map)->select();
                $labels_arr = array_column($labels, "name");
            }
            $info['user']['labels'] = $labels_arr;

            $this->success('', '', $info);
        }
    }

    //发送模板消息
    public function sendTemplateMessage($templateId, $openId, $content)
    {
        $data = [
            // 'first' => [
            //     'value' => WxTemplateMessage::MESSAGE_TITLES[$order->status],
            //     'color' => '#173177'
            // ],
            'keyword1' => [
                'value' => $content,
                'color' => '#173177'
            ],
            'keyword2' => [
                'value' => date('Y-m-d H:i:s', time()),
                'color' => '#173177'
            ]
        ];

        $collection = new FormIdCollection($openId);
        $formId = $collection->get(true);
        $sendRes = WxTemplateMessage::sendTemplateMessage($templateId, $formId, $openId, $data);

        // return $sendRes;
        // if ($sendRes->errcode == 0) {
        //     self::show(1, '模板发送成功', [$sendRes]);
        // } else {
        //     self::show(0, '模板发送失败', [$sendRes]);
        // }
    }
}
