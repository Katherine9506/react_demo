<?php
namespace app\admin\controller;

use app\common\model\Slide as SlideModel;

/**
 * 轮播图管理
 * Class Slide
 */
class Slide extends AdminBase
{
    /**
     * 轮播图管理
     */
    public function index()
    {
        $this->assign("list", SlideModel::getList());
        return $this->fetch();
    }

    /**
     * 添加轮播图
     * @return mixed
     */
    public function add()
    {
        if ($post = request()->post())
        {
            $result = SlideModel::addSlide($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        return $this->fetch("save");
    }

    /**
     * 编辑轮播图
     */
    public function edit($id = null)
    {
        if ($post = request()->post())
        {
            $result = SlideModel::editSlide($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        $this->assign("detail", SlideModel::detailSlide($id));
        return $this->fetch("save");
    }

    // 删除指标
    public function delete($id = null)
    {
        if (request()->isAjax())
        {
            $result = SlideModel::deleteSlide($id);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }
    }
}
