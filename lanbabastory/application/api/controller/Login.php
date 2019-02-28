<?php

namespace app\api\controller;

class Login extends BaseController
{
    /* 小程序登录 */
    public function login()
    {
        if ($this->loginStatus) {
            return $this->successJson(['status' => true, 'msg' => '登陆成功', 'loginStatus' => $this->loginStatus]);
        }
        return $this->successJson(['status' => false, 'msg' => '登录失败']);
    }

    /* 判断用户是否登录 */
    public function isLogin()
    {
        if ($this->loginStatus['openid']) {
            return $this->successJson(['status' => true, 'msg' => '已登录']);
        }
        return $this->successJson(['status' => false, 'msg' => '未登录']);
    }
}