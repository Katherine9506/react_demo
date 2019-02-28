<?php
namespace app\admin\controller;

use app\common\model\AlbumCategory as AlbumCategoryModel;

/**
 * 专辑分类管理
 */
class AlbumCategory extends AdminBase
{
    protected function _initialize()
    {
        parent::_initialize();
        $this->assign("statusList", AlbumCategoryModel::$statusList);
    }

    /**
     * 专辑分类管理
     */
    public function index()
    {
        $this->assign("list", AlbumCategoryModel::getList());
        return $this->fetch();
    }

    /**
     * 添加专辑分类
     * @return mixed
     */
    public function add()
    {
        if ($post = request()->post())
        {
            $result = AlbumCategoryModel::addCategory($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        return $this->fetch("save");
    }

    /**
     * 编辑专辑分类
     */
    public function edit($id = null)
    {
        if ($post = request()->post())
        {
            $result = AlbumCategoryModel::editCategory($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        $this->assign("detail", AlbumCategoryModel::detailCategory($id));
        return $this->fetch("save");
    }

    public function del($id = null)
    {
        if (request()->isAjax())
        {
            $result = AlbumCategoryModel::deleteCategory($id);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }
    }
}
