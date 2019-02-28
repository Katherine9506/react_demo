<?php

namespace app\api\controller;

use app\common\model\Slide as SlideModel;

class Slide extends BaseController
{
    /* 轮播图片 */
    public function getAll()
    {
        $slideList = SlideModel::getAppList();
        return $this->successJson($slideList);
    }
}