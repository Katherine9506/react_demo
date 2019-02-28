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
use think\Db;
use think\Cache;
use app\tplay\lib\Authcheck;

class System extends Authcheck
{
    public function index()
    {
        $limit = $this->request->has('limit') ? $this->request->param('limit') : 20;
        $data = \think\loader::model('common/system')->where(['status'=>['>',0]])->order('create_time asc')->paginate($limit,false,['query'=>$this->request->param()]);
        
        return $this->showList($data);
    }

    public function edit()
    {
        if($this->request->isPost()) {
            $post = $this->request->post();
            $validate = new \think\Validate([
                'key'  => 'require',
                'field' => 'require|length:1,50',
                'value' => 'require|length:1,1000',
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }
            if(empty(Db::name('system')->where(['key'=>$post['key']])->find())) {
                return $this->error('非法请求');
            }

            $data[$post['field']] = $post['value'];
            if(false == \think\loader::model('common/system')->allowField(true)->save($data,['key'=>$post['key']])) {
                return $this->error('操作失败');
            }
            return $this->success('操作成功');
        } else {
            return $this->error('非法请求');
        }
    }

    public function add()
    {
        if($this->request->isPost()) {
            $post = $this->request->post();
            $validate = new \think\Validate([
                'key'  => 'require|length:1,50',
                'name' => 'require|length:1,50',
                'value' => 'require|length:1,1000',
            ]);
            if (!$validate->check($post)) {
                return $this->error($validate->getError());
            }

            if(!empty(Db::name('system')->where(['key'=>$post['key']])->find())) {
                return $this->error('key已存在');
            }
            
            if(false == \think\loader::model('common/system')->allowField(true)->save($post)) {
                return $this->error('操作失败');
            }
            return $this->success('操作成功');
        } else {
            return $this->error('非法请求');
        }
    }

    public function del()
    {
        $param = $this->request->param();
        $array = [];
        if(!is_array($param['key'])) {
            $array[] = $param['key'];
        } else {
            $array = $param['key'];
        }
        if(false == $this->soft(['model'=>'common/system','key'=>'key','index'=>$array])) {
            return $this->error('操作失败');
        }
        return $this->success('操作成功');
    }

    /**
     * 获取文件存储配置信息
     */
    public function storageConfig()
    {
        if ($this->request->isPost()) 
        {
            $post = $this->request->post();
            //保存配置数据
            // var_dump($post);
            $data['value'] = json_encode($post);
            
            $file_config = \think\loader::model('common/system')->where(['key' => 'file_storage'])->find();

            if ($file_config) 
            {
                // Db::name('system')->where(['name' => 'file_storage'])->update(['value' => 'fdjsofjo']);
                \think\loader::model('common/system')->where(['key' => 'file_storage'])->update($data);
            }
            else
            {
                $data['key'] = 'file_storage';
                $data['name'] = "存储配置";
                $data['type'] = 1;
                $data['status'] = 1;
                $data['create_time'] = time();
                $data['update_time'] = time();

                \think\loader::model('common/system')->insert($data);
            }
            return $this->success('操作成功');
        }
        else
        {
            $file_storage = \think\loader::model('common/system')->where(['key' => 'file_storage'])->find();
            $file_storage = json_decode($file_storage, true);
            $file_storage['value'] = json_decode($file_storage['value'], true);

            $this->success('','', $file_storage);
        }
    }
}
