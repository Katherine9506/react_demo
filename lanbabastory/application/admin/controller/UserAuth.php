<?php
namespace app\admin\controller;

use app\common\model\UserAuth as UserAuthModel;

/**
 * 用户认证
 */
class UserAuth extends AdminBase
{
    public function index()
    {
        $this->assign("list", UserAuthModel::getList());
        return $this->fetch();
    }

    //认证审核
    public function auth()
    {
        $id = \input("id");

        if ($id) {
            if ($post = request()->post()) {
                $result = UserAuthModel::auditUser($id, $post);
                return json($result);
            }
        }

        return $this->fetch();
    }
}
