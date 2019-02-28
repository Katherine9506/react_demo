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

use think\Db;

class Authcheck extends Base
{
    protected function _initialize()
    {
        parent::_initialize();
        $rule = $this->controller . '/' . $this->action;
        $auth = new Auth();
        if (false == $auth->check($rule, $this->admin_id)) {
            return $this->error('想啥呢，咱没那权限');
        }

        $storage_config = Db::name('system')->where(['key' => 'file_storage'])->value('value');
        $storage_config = json_decode($storage_config, true);
        if ($storage_config['storage_type'] == 'oss') {
            $this->domain = $storage_config['storage_oss_domain'];
        } else {
            $this->domain = $this->request->domain();
        }
    }
}
