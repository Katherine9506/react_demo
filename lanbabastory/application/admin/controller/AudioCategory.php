<?php
namespace app\admin\controller;

use app\common\model\AudioCategory as AudioCategoryModel;

/**
 * 音频分类管理
 * Class Album
 */
class AudioCategory extends AdminBase
{
    protected function _initialize()
    {
        parent::_initialize();
        $this->assign("statusList", AudioCategoryModel::$statusList);
    }

    /**
     * 音频分类管理
     */
    public function index()
    {
        $this->assign("list", AudioCategoryModel::getList());
        return $this->fetch();
    }

    /**
     * 添加音频分类
     * @return mixed
     */
    public function add()
    {
        if ($post = request()->post())
        {
            $result = AudioCategoryModel::addCategory($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        return $this->fetch("save");
    }

    /**
     * 编辑音频分类
     */
    public function edit($id = null)
    {
        if ($post = request()->post())
        {
            $result = AudioCategoryModel::editCategory($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        $this->assign("detail", AudioCategoryModel::detailCategory($id));
        return $this->fetch("save");
    }

    // 删除指标
    public function del($id = null)
    {
        if (request()->isAjax())
        {
            $result = AudioCategoryModel::deleteCategory($id);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }
    }
}
