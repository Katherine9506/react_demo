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

namespace app\index\controller;

use app\index\controller\Base;
use \think\Cookie;
use \think\Db;

class Article extends Base
{
    //列表页
    public function index()
    {
        $model = new \app\common\model\Content();
        $limit = $this->request->has("limit") ? $this->request->param("limit") : 10;

        $param = $this->request->param();

        if (empty($param['type'])) 
        {
            $this->error('参数错误！');
        }

        $group_id = Db::name('content_cate_group')->where(['key' => $param['type']])->value('id');
        $cate_id  = Db::name('content_cate')->where(['content_cate_group_id' => $group_id])->value('id');
        $where['content_cate_id'] = $cate_id;

        $this->assign('article_cate_id', $cate_id);

        if (isset($param['keywords']) and !empty($param['keywords'])) 
        {
            $where['title|content'] = ['like', '%' . $param['keywords'] . '%'];
        }

        $where['status'] = 1;

        $article = $model->withCount(['message'=>function($query){
                                        $query->where('status',1);
                                    }])
                ->where($where)
                ->order('create_time desc')
                ->paginate($limit,false,['query'=>$this->request->param()]);
        foreach ($article as $k => $v) 
        {
            $article[$k]['img'] = explode(",", $v['img']);
            $article[$k]['create_time'] = strtotime($v['create_time']);
        }
        $this->assign('info',$article);

        $current_cate = \think\Loader::model("common/content_cate")->where(['id' => $cate_id])->find();
        $template = $current_cate['list_template'];
        $this->assign('current_cate', $current_cate);

        //当前文章同级分类列表
        $cate_list = \think\Loader::model("common/content_cate")
                    ->field('id,name')
                    ->where(['content_cate_group_id' => $current_cate['content_cate_group_id']])
                    ->select();
        foreach ($cate_list as $k => $v) 
        {
            $content = \think\Loader::model("common/content")
                    ->field('id,title,content_cate_id')
                    ->where(['content_cate_id' => $v['id']])
                    ->find();
            $cate_list[$k]['content_id'] = $content['id'];
        }
        
        $this->assign('cate_list', $cate_list);

        if ($template) 
        {
            return $this->fetch(":{$template}");
        }
        return $this->fetch();
    }

    //详情页
    public function show()
    {
        $param = $this->request->param();
        $this->assign('current', $param['current']);
        $validate = new \think\Validate([
            'id'  => 'require|number|length:1,11',
        ]);

        if (!$validate->check($param)) {
            return $this->error($validate->getError());
        }

        $model = new \app\common\model\Content();
        $article = $model->where(['status'=>1,'id'=>$param['id']])->find();
        if(empty($article)) {
            return $this->error('文章不存在');
        }
        $model->where(['id'=>$article['id']])->setInc('num');

        $article['last'] = $model->where(['status'=>1, 'content_cate_id' => $article['content_cate_id'], 'create_time'=>['<',strtotime($article['create_time'])]])->order('create_time desc')->field('id,title')->find();
        $article['next'] = $model->where(['status'=>1, 'content_cate_id' => $article['content_cate_id'], 'create_time'=>['>',strtotime($article['create_time'])]])->order('create_time asc')->field('id,title')->find();

        $this->assign('info',$article);

        $messages = \think\Loader::model("common/message")->where(['status'=>1,'content_id'=>$article['id']])->order('create_time desc')->paginate(10,false,['fragment'=>'tpblog-msg']);
        $this->assign('messages',$messages);

        //当前文章所属分类
        $article_cate = \think\Loader::model("common/content_cate")->where(['id' => $article['content_cate_id']])->find();

        //当前文章同级分类列表
        $cate_list = \think\Loader::model("common/content_cate")
                    ->field('id,name')
                    ->where(['content_cate_group_id' => $article_cate['content_cate_group_id']])
                    ->select();

        foreach ($cate_list as $k => $v) 
        {
            $content = \think\Loader::model("common/content")
                    ->field('id,title,content_cate_id')
                    ->where(['content_cate_id' => $v['id']])
                    ->find();
            $cate_list[$k]['content_id'] = $content['id'];
        }
        $this->assign('cate_list', $cate_list);
        if ($article_cate['detail_template']) 
        {
            return $this->fetch(":{$article_cate['detail_template']}");
        }
        return $this->fetch();
    }

    //单页面
    public function single()
    {
        $param = $this->request->param();
        // $validate = new \think\Validate([
        //     'id'  => 'require|number|length:1,11',
        // ]);

        // if (!$validate->check($param)) {
        //     return $this->error($validate->getError());
        // }

        if (empty($param['type'])) 
        {
            $this->error('参数错误！');
        }

        $group_id = Db::name('content_cate_group')->where(['key' => $param['type']])->value('id');
        $cate_id  = Db::name('content_cate')->where(['content_cate_group_id' => $group_id])->value('id');
        // $where['content_cate_id'] = $cate_id;

        $model = new \app\common\model\Content();
        $article = $model->where(['status'=>1,'content_cate_id'=>$cate_id])->find();
        if(empty($article)) 
        {
            return $this->error('文章不存在');
        }
        $model->where(['id'=>$article['id']])->setInc('num');

        $this->assign('info', $article);

        // $messages = \think\Loader::model("common/message")->where(['status'=>1,'content_id'=>$article['id']])->order('create_time desc')->paginate(10,false,['fragment'=>'tpblog-msg']);
        // $this->assign('messages',$messages);

        //当前文章所属分类
        $article_cate = \think\Loader::model("common/content_cate")->where(['id' => $cate_id])->find();
        
        if ($article_cate['detail_template']) 
        {
            return $this->fetch(":{$article_cate['detail_template']}");
        }
        return $this->fetch();
    }
}
