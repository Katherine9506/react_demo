<?php

namespace app\api\controller;

use app\common\model\Feedback;
use app\common\model\User;
use think\Db;
use think\Loader;
use think\Request;

class Index extends Base
{
    //技能列表
    public function skillList()
    {
        $limit = isset($this->param['rows']) ? $this->param['rows'] : 20;

        $data = Loader::model('common/skill')
            ->field('id,name,icon_id')
            ->where(['status' => 1])
            ->order('sort')
            ->paginate($limit, false, ['query' => $this->param])
            ->each(function ($item, $key) {
                $item->icon = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $item->icon_id])->value('path'));
            });

        return $this->show(1, '', $this->setSign($data));
    }

    public function carousel()
    {
        $key = isset($this->param['key']) ? $this->param['key'] : \think\Db::name('carousel_cate')->where('is_main', 1)->value('key');
        $cate_id = \think\Db::name('carousel_cate')->where('key', $key)->value('id');
        $data = \think\Db::name('carousel')->where(['carousel_cate_id' => $cate_id])->order('order asc')->select();
        foreach ($data as $k => $v) {
            $data[$k]['img'] = $this->domain . $v['img'];
        }

        return $this->show(1, '', $this->setSign($data));
    }

    public function cate()
    {
        $pid = isset($this->param['pid']) ? $this->param['pid'] : 0;
        $key = isset($this->param['key']) ? $this->param['key'] : \think\Db::name('content_cate_group')->where('is_main', 1)->value('key');
        $cate_id = \think\Db::name('content_cate_group')->where('key', $key)->value('id');
        $data = \think\Db::name('content_cate')->where(['content_cate_group_id' => $cate_id, 'pid' => $pid])->order('create_time asc')->select();

        return $this->show(1, '', $this->setSign($data));
    }

    public function menu()
    {
        $pid = isset($this->param['pid']) ? $this->param['pid'] : 0;
        $key = isset($this->param['key']) ? $this->param['key'] : \think\Db::name('index_menu_cate')->where('is_main', 1)->value('key');
        $cate_id = \think\Db::name('index_menu_cate')->where('key', $key)->value('id');
        $data = \think\Db::name('index_menu')->where(['index_menu_cate_id' => $cate_id, 'pid' => $pid])->order('create_time asc')->select();

        return $this->show(1, '', $this->setSign($data));
    }

    public function content()
    {
        $limit = isset($this->param['rows']) ? $this->param['rows'] : 20;
        $key = isset($this->param['key']) ? $this->param['key'] : \think\Db::name('content_cate_group')->where('is_main', 1)->value('key');
        $group_id = \think\Db::name('content_cate_group')->where('key', $key)->value('id');
        $cate_id = isset($this->param['cate_id']) ? $this->param['cate_id'] : \think\Db::name('content_cate')->where(['content_cate_group_id' => ['IN', $group_id]])->column('id');

        $data = \think\loader::model('common/content')->where(['content_cate_id' => ['IN', $cate_id], 'status' => ['>', 0]])->order('create_time desc')->paginate($limit, false, ['page' => $this->param['page'], 'query' => $this->param])->each(function ($item, $key) {
            $item->img = $this->domain . explode(',', $item->img)[0];
        });
        return $this->show(1, '', $this->setSign($data));
    }

    public function contentInfo()
    {
        if (!isset($this->param['id']) or $this->param['id'] < 1) {
            return $this->show(0, '参数不正确');
        }
        $data['goods'] = \think\Db::name('content')
            ->where(['id' => $this->param['id'], 'status' => ['>', 0]])
            ->find();
        $data['goods']['img'] = explode(',', $data['goods']['img']);
        foreach ($data['goods']['img'] as $k => $v) {
            $data['goods']['img'][$k] = $this->domain . $v;
        }
        $data['message'] = \think\Db::name('message')
            ->field('*,w.id as user_id,a.create_time as time')
            ->alias('a')
            ->join('user w', 'a.user_id = w.id', 'LEFT')
            ->where(['a.content_id' => $this->param['id'], 'a.status' => 1])
            ->order('a.create_time desc')
            ->limit(2)
            ->select();
        foreach ($data['message'] as $k => $v) {
            $data['message'][$k]['time'] = date('Y-m-d', $v['time']);
        }

        return $this->show(1, '', $this->setSign($data));
    }

    //价格列表
    public function priceList()
    {
        if ($this->request->has('gender')) {
            $gender = $this->request->param('gender');
            $gender = (int)$gender != 0 ? (int)$gender : $gender;
        }
        $type = $this->request->has('type') ? $this->request->param('type') : 'general';
        if ($sid = (int)$this->request->param('sid')) {
            if (isset($gender) && $gender) {
                $gender = $gender == 1 || $gender == 2 ? $gender : $gender == 'boy' ? 1 : 2;//gender参数可为1,2或者boy,girl
                $matherUser = Db::table('lg_user')->where('gender', $gender)->column('id');
            }
            $query = Db::name('skill_price')->field('id,uid,price');
            if ($type == 'newbie') {
                /* 新人 */
                $query->order('id', 'desc');
            }
            if ($type == 'hot') {
                /* 热门:订单数，平均评价分数 */
                $queryString = 'select s.id,u.id uid,price,name,count(*) orders,avg(rate) avgrate from lg_skill_price s left join lg_user u on s.uid = u.id left join lg_order o on o.play_uid = u.id where s.sid = :sid limit 8';
                if (isset($gender) && $gender) {
                    $queryString .= ' and u.gender = :gender';
                }
                $queryString .= ' group by u.id order by orders desc,avgrate desc';
            }
            if (isset($matherUser)) {
                $query->whereIn('uid', $matherUser);
            }
            if (isset($queryString)) {
                if (isset($gender) && $gender) {
                    $price_list = Db::query($queryString, ['sid' => $sid, 'gender' => $gender]);
                } else {
                    $price_list = Db::query($queryString, ['sid' => $sid]);
                }
            } else {
//                $price_list = $query->where(['sid' => $sid, 'status' => 1])->select();
                $price_list = $query->where(['sid' => $sid, 'status' => 1])->paginate(8)->items();
            }
            foreach ($price_list as $k => $v) {
                $price_list[$k]['user_info'] = Db::name('user')->field('id,name,label_ids,cover_id,city')->where(['id' => $v['uid']])->find();
                $price_list[$k]['user_info']['cover'] = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $price_list[$k]['user_info']['cover_id']])->value('path'));
                $paragraph_id = Db::name('user_skills')->where(['uid' => $v['uid'], 'sid' => $sid])->value('paragraph_id');
                $price_list[$k]['user_info']['paragraph'] = Db::name('paragraph')->where(['id' => $paragraph_id])->value('name');
            }
            return $this->show(1, '', $this->setSign($price_list));
        } else {
            if (isset($gender)) {
                $gender = $gender == 'boy' ? 1 : 2;
                $matherUser = Db::table('lg_user')->where('gender', $gender)->column('id');
            }
            $skill_list = Db::name('skill')->field('id,name')->where(['status' => 1])->select();
            foreach ($skill_list as $k => $v) {
                $query = Db::name('skill_price')->field('id,uid,price');
                if (isset($matherUser)) {
                    $query->whereIn('uid', $matherUser);
                }
//                $price_list = $query->where(['sid' => $v['id'], 'status' => 1])->select();
                $price_list = $query->where(['sid' => $v['id'], 'status' => 1])->paginate(8)->items();
                if ($price_list) {
                    foreach ($price_list as $key => $val) {
                        $price_list[$key]['user_info'] = Db::name('user')->field('id,name,label_ids,cover_id,city')->where(['id' => $val['uid']])->find();
                        $price_list[$key]['user_info']['cover'] = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $price_list[$key]['user_info']['cover_id']])->value('path'));

                        $paragraph_id = Db::name('user_skills')->where(['uid' => $val['uid'], 'sid' => $v['id']])->value('paragraph_id');
                        $price_list[$key]['user_info']['paragraph'] = Db::name('paragraph')->where(['id' => $paragraph_id])->value('name');
                        $label_ids = explode(',', $price_list[$key]['user_info']['label_ids']);
                        $price_list[$key]['user_info']['tags'] = Db::table('lg_label')->whereIn('id', $label_ids)->column('name');
                    }
                    $skill_list[$k]['price_list'] = $price_list;
                } else {
                    unset($skill_list[$k]);
                }
            }
            return $this->show(1, '', $this->setSign($skill_list));
        }
    }

    //价格列表2
    public function priceListViaSearch()
    {
        $queryString = "select p.* from lg_skill_price p left join lg_user u on p.uid = u.id where u.name like :name";

        $playname = $this->request->post('name');

        $priceList = Db::query($queryString, ['name' => "%{$playname}%"]);

        foreach ($priceList as $k => $v) {
            $priceList[$k]['user_info'] = Db::name('user')->field('id,name,label_ids,cover_id,city')->where(['id' => $v['uid']])->find();
            $priceList[$k]['user_info']['cover'] = str_replace("\\", "/", $this->domain . Db::name('resource')->where(['id' => $priceList[$k]['user_info']['cover_id']])->value('path'));
            $paragraph_id = Db::name('user_skills')->where(['uid' => $v['uid'], 'sid' => $v['sid']])->value('paragraph_id');
            $priceList[$k]['user_info']['paragraph'] = Db::name('paragraph')->where(['id' => $paragraph_id])->value('name');
        }

        return $this->show(1, '', $this->setSign($priceList));
    }

    //价格详情信息
    public function priceDetail()
    {
        $id = $this->request->post('id');

        $price_detail = Db::name('skill_price')->where(['id' => $id])->find();

        $skill = Db::name('skill')->where(['id' => $price_detail['sid']])->find();
        $user_skill = Db::name('user_skills')->field('paragraph_id,label_ids,intro')->where(['uid' => $price_detail['uid'], 'sid' => $price_detail['sid']])->find();

        //当前陪玩师接单总数
        $price_detail['order_count'] = Db::name('order')->where(['play_uid' => $price_detail['uid']])->count();
        $order_ids = Db::name('order')->field('id')->where(['sid' => $price_detail['id'], 'play_uid' => 1, 'status' => 7])->find();
        $price_detail['score'] = Db::name('evaluate')->whereIn('order_id', $order_ids)->avg('score');

        $label_name = $this->getLabel($user_skill['label_ids'], 1);

        $skill['paragraph'] = Db::name('paragraph')->where(['id' => $user_skill['paragraph_id']])->value('name');
        $skill['label'] = $label_name;
        $skill['intro'] = $user_skill['intro'];

        $result['user_info'] = Db::name('user')->field('id,name,label_ids,image_ids,thumb,city,province,area,audio_id')->where(['id' => $price_detail['uid']])->find();
        $image_where['id'] = ['in', $result['user_info']['image_ids']];
        $images = Db::name('resource')->field('path')->where($image_where)->select();
        foreach ($images as $key => $val) {
            $images[$key]['path'] = str_replace("\\", "/", $this->domain . $val['path']);
        }
        $result['user_info']['images'] = array_column($images, 'path');
        $result['user_info']['label'] = $this->getLabel($result['user_info']['label_ids'], 2);
        $result['user_info']['audio'] = $this->domain . Db::name('resource')->find($result['user_info']['audio_id'])['path'];

        $result['price_detail'] = $price_detail;
        $result['skill'] = $skill;

        return $this->show(1, '', $this->setSign($result));
    }

    //获取用户全部技能
    public function getUserSkills($user_id, $exclude_sid = null)
    {
        $query = Db::name('skill_price')->where('uid', $user_id);
        if ($exclude_sid) {
            $query->where('sid', '<>', $exclude_sid);
        }
        $prices = $query->select();
        foreach ($prices as $k => $skillPrice) {
            $skill = Db::name('skill')->field('icon_id,name')->find($skillPrice['sid']);
            $icon = Db::name('resource')->where('id', $skill['icon_id'])->value('path');
            $labelIds = Db::name('user_skills')->where(['uid' => $user_id, 'sid' => $skillPrice['sid']])->value('label_ids');
            $label = $this->getLabel($labelIds, 1);

            $prices[$k]['name'] = $skill['name'];
            $prices[$k]['label'] = $label;
            $prices[$k]['icon'] = str_replace("\\", "/", $this->domain . $icon);
        }

        return self::show(1, '', $prices);
    }

    public function getEvaluate()
    {
        $params = $this->request->post();
        $uid = $params['uid'];
        $sid = $params['sid'];
        $limit = isset($this->param['rows']) ? $this->param['rows'] : 10;

        $order_ids = Db::name('order')->field('id')->where(['sid' => $sid, 'play_uid' => 1, 'status' => 7])->column('id');

        $data = \think\loader::model('common/evaluate')
            ->field('boss_uid,content,score,is_anony,create_time')
            ->where(['status' => 1, 'play_uid' => $uid])
            ->whereIn('order_id', $order_ids)
            ->order('create_time')
            ->paginate($limit, false, ['page' => $this->param['page'], 'query' => $this->param])
            ->each(function ($item, $key) {
                $item->avatar = Db::name('user')->where(['id' => $item->boss_uid])->value('thumb');
                $item->name = Db::name('user')->where(['id' => $item->boss_uid])->value('name');
            });

        return $this->show(1, '', $this->setSign($data));
    }

    private function getLabel($ids_str, $type)
    {
        $skill_label = Db::name('label')->field('id,name')->where(['type' => $type])->select();
        $label_arr = explode(",", $ids_str);
        $label_name = [];
        foreach ($skill_label as $k => $v) {
            if (in_array($v['id'], $label_arr)) {
                $label_name[] = $v['name'];
            }
        }

        return $label_name;
    }

    public function feedbackCreate()
    {
        $params = $this->request->param();
        $validate = new \think\Validate([
            'content' => 'require',
            'contact' => 'require',
        ], [
            'content.require' => '请正确填写您的反馈建议',
            'content.max' => '反馈建议最多不能超过300个字符',
            'contact' => '输入您的联系方式，方便我们联系您'
        ]);

        if (!$validate->check($params)) {
            return $this->show(0, $validate->getError());
        }

        $postData = request()->param();
        $user = User::get(['openid' => $postData['openid']]);
        $postData['uid'] = $user->id;
        $postData['uname'] = $user->name;
        Feedback::create($postData, ['content', 'images', 'contact', 'uid', 'uname']);

        return $this->show(1, '反馈成功');
    }

    public function startPrice()
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');

        $data = $this->request->param('data/a');
        if ($data['bool'] == 1) {
            $price_map['uid'] = $uid;
            $price_map['sid'] = $data['sid'];
            $price_map['price'] = ['gt', '0'];
            $have_price = Db::name('skill_price')->where($price_map)->find();
            if (!$have_price) {
                return $this->show(0, '请先设置价格！');
            }
            //更新用户技能接单状态
            Db::name('user_skills')->where(['uid' => $uid, 'sid' => $data['sid']])->update(['order_status' => 1]);
            //更新所有价格状态
            Db::name('skill_price')->where(['uid' => $uid, 'sid' => $data['sid']])->update(['status' => 1]);
        } else {
            //更新用户技能接单状态
            Db::name('user_skills')->where(['uid' => $uid, 'sid' => $data['sid']])->update(['order_status' => 0]);
            //更新所有价格状态
            Db::name('skill_price')->where(['uid' => $uid, 'sid' => $data['sid']])->update(['status' => 0]);
        }
        return $this->show(1, '设置成功');
    }
}
