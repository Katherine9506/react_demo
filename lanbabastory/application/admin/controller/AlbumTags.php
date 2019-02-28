<?php
namespace app\admin\controller;

use app\common\model\AlbumTags as AlbumTagsModel;

/**
 * 标签管理
 */
class AlbumTags extends AdminBase
{
    protected function _initialize()
    {
        parent::_initialize();
        $this->assign("statusList", AlbumTagsModel::$statusList);
    }

    /**
     * 标签管理
     */
    public function index()
    {
        $this->assign("list", AlbumTagsModel::getList());
        return $this->fetch();
    }

    /**
     * 添加标签
     * @return mixed
     */
    public function add()
    {
        if ($post = request()->post())
        {
            $result = AlbumTagsModel::addTag($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        return $this->fetch("save");
    }

    /**
     * 编辑标签
     */
    public function edit($id = null)
    {
        if ($post = request()->post())
        {
            $result = AlbumTagsModel::editTag($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        $this->assign("detail", AlbumTagsModel::detailTag($id));
        return $this->fetch("save");
    }

    public function del($id = null)
    {
        if (request()->isAjax())
        {
            $result = AlbumTagsModel::deleteTag($id);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }
    }
}
