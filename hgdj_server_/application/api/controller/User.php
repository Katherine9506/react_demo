<?php
namespace app\api\controller;
use app\api\controller\Restrict;
use \think\Db;

class User extends Restrict
{
    public function createMsg()
    {
        $post = $this->param;
        $validate = new \think\Validate([
            'message'  => 'require|length:1,120',
            'content_id' => 'require|length:1,11|number',
        ]);

        if (!$validate->check($post)) {
            return $this->show(0,$validate->getError());
        }

        $post['message'] = $this->ubbReplace($post['message']);

        if(preg_match("/@(.*)\s/",$post['message'],$reply)) {
            $user = Db::name('user')->where(['status'=>1,'name'=>$reply[1]])->find();
            if(empty($user)) {
                return $this->show(0,'你@的用户不存在');
            }
            $post['to_user_id'] = $user['id'];
            $post['message'] = preg_replace ( "/@(.*) /", "",$post['message']);
            if(empty($post['message'])){
                return $this->show(0,'请填写评论内容');
            } 
            $post['message'] = "<span style='color:#1E9FFF'> @".$user['name']." </span>".$post['message'];
        }

        $post['message'] = preg_replace ( "[\[em_([0-9]*)\]]", "<img src=\"/static/public/qqFace/arclist/$1.gif\" />", $post['message']);
                
        if(!empty(Db::name('message')->where(['user_id'=>$this->user_id,'create_time'=>['>=',time()-60]])->find())){
            return $this->error('60秒内只能提交一次发言');
        }

        $post['create_time'] = time();
        $post['ip'] = $this->request->ip();
        $post['user_id'] = $this->user_id;
        if(false ==  \think\Loader::model("common/message")->allowField(true)->save($post)){
            return $this->error('提交失败');
        }

        $user = Db::name('user')->where(['id'=>$this->user_id])->find();

        $data = [
          'id' => \think\Loader::model("common/message")->id,
          'name' => $user['name'],
          'create_time' => date('Y-m-d H:i:s',time()),
          'thumb' => $user['thumb'],
          'message' => $post['message']
        ];
        return $this->show(1,'',$this->setSign($data));
    }

    protected function ubbReplace($str) {
        $str = str_replace ( ">", '<；', $str );    
        $str = str_replace ( ">", '>；', $str );
        $str = str_replace ( "\n", '>；br/>；', $str );
        return $str;
    }
}
