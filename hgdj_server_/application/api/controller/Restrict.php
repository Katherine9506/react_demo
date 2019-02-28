<?php
namespace app\api\controller;
use app\api\controller\Base;
use think\Cache;
use think\Session;

class Restrict extends Base
{
    public $user_id;

    protected function _initialize()
    {
        parent::_initialize();

        if(empty($this->param['login_string'])){
            return $this->show(2,'请先登录');
        }

        if(Cache::get($this->param['login_string'])){
        	$user = Cache::get($this->param['login_string']);
        } else {
        	$user = \think\Db::name('user')->where(['login_string'=>$this->param['login_string']])->find();

        	if(empty($user)){
        		return $this->show(2,'登录凭证已过期，请重新登录');
        	}

        	$options = [
			    // 缓存类型为File
			    'type'  =>  'File', 
			    // 缓存有效期为永久有效
			    'expire'=>  7200, 
			    //缓存前缀
			    'prefix'=>  'think',
			     // 指定缓存目录
			    'path'  =>  '../runtime/cache/',
			];
			Cache::connect($options);

			Cache::set($this->param['login_string'],$user,7200);
        }

        if($user['last_login_time']<time()-24*60*60){
        	Cache::rm($this->param['login_string']);
        	$this->show(2,'登录超时，请重新登录');
        }
        
        $this->user_id = $user['id'];
    }
}
